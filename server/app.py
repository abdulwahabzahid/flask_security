import os
from flask import Flask, abort, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import jwt
from jwt import decode as jwt_decode
import datetime
from dotenv import load_dotenv
from pymongo import MongoClient
from bson.objectid import ObjectId  

load_dotenv()

app = Flask(__name__, static_folder='build', static_url_path='')
cors_origins = os.getenv('CORS_ORIGINS', '').split(',')
CORS(app, origins=cors_origins)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SESSION_TYPE'] = 'filesystem'  

mongo_uri = os.getenv('MONGO_URI')
client = MongoClient(mongo_uri)
db = client['db1']
collection = db['credentials']
documents_collection = db['documents']

def verify_token(func):
    def wrapper(*args, **kwargs):
        auth_cookie = request.cookies.get('token')  
        print("HERE IS THE TOKEN")
        print(auth_cookie)
        if auth_cookie:
            token_parts = auth_cookie.split("%20")
            if len(token_parts) == 2 and token_parts[0] == 'Bearer': 
                token = token_parts[1]
                try:
                    decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
                    kwargs['decoded_token'] = decoded_token 
                    print("TOKEN VALIDATED")
                    return func(*args, **kwargs)
                except jwt.ExpiredSignatureError:
                    return jsonify({'message': 'Token has expired'}), 401
                except jwt.InvalidTokenError:
                    return jsonify({'message': 'Invalid token'}), 401
            else:
                return jsonify({'message': 'Invalid authorization token format'}), 401
        return jsonify({'message': 'Missing or invalid authorization token'}), 401
    wrapper.__name__ = func.__name__
    return wrapper

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username') 
    password = data.get('password')
    user = collection.find_one({"username": username, "password": password})
    
    if user:
        if user.get('active') == "true":
            token = jwt.encode({
                'user_id': str(user['_id']), 
                'username': username,
                'role': user['role'],
                'exp': datetime.datetime.now() + datetime.timedelta(hours=1)
            }, app.config['SECRET_KEY'])

            print(f"Generated token for {username}: {token}")
            return jsonify({'token': token})
        else:
            return jsonify({'message': 'User account is inactive'}), 401
    else:
        return jsonify({'message': 'Invalid credentials'}), 403
    

@app.route('/user', methods=['GET'])
@verify_token
def user_page(**kwargs):
    decoded_token = kwargs.get('decoded_token')
    print(decoded_token)
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/admin', methods=['GET'])
@verify_token
def admin_page(**kwargs):
    decoded_token = kwargs.get('decoded_token')
    print(decoded_token)
    if decoded_token and decoded_token.get('role') == 'admin':
        return send_from_directory(app.static_folder, 'index.html')
    else:
        abort(404)

@app.route('/superadmin', methods=['GET'])
@verify_token
def super_admin_page(**kwargs):
    decoded_token = kwargs.get('decoded_token')
    print(decoded_token)
    if decoded_token and decoded_token.get('role') == 'superadmin':
        return send_from_directory(app.static_folder, 'index.html')
    else:
        abort(404)


@app.route('/document-service', methods=['GET', 'POST', 'PUT', 'DELETE'])
@verify_token
def document_service(**kwargs):
    decoded_token = kwargs.get('decoded_token')
    user_role = decoded_token.get('role')

    if request.method == 'GET':
        documents = list(documents_collection.find({}, {"_id": 1, "title": 1, "content": 1, "name": 1, "position": 1, "department": 1}))
        for doc in documents:
            doc['_id'] = str(doc['_id'])
        return jsonify(documents), 200

    elif request.method == 'POST':
        if user_role in ['admin', 'superadmin']:
            data = request.json
            document_id = ObjectId(data.get('id'))
            documents_collection.update_one(
                {'_id': document_id},
                {'$set': {'content': data.get('content')}}
            )
            return jsonify({'message': 'Document edited successfully'}), 200
        else:
            return jsonify({'message': 'Permission denied'}), 403

    elif request.method == 'PUT':
        if user_role == 'superadmin':
            data = request.json
            new_document = {
                "title": data.get('title'),
                "content": data.get('content'),
                "name": data.get('name'),  
                "position": data.get('position'),  
                "department": data.get('department'),  
            }
            result = documents_collection.insert_one(new_document)
            new_document['_id'] = str(result.inserted_id)
            return jsonify({'message': 'Document added successfully', 'document': new_document}), 200
        else:
            return jsonify({'message': 'Permission denied'}), 403


@app.route('/document-service/<string:id>', methods=['DELETE'])
@verify_token
def delete_document(id, **kwargs):
    decoded_token = kwargs.get('decoded_token')
    user_role = decoded_token.get('role')

    if user_role != 'superadmin':
        return jsonify({'message': 'Permission denied'}), 403

    try:
        document_id = ObjectId(id)
        result = documents_collection.delete_one({'_id': document_id})
        if result.deleted_count > 0:
            return jsonify({'message': 'Document deleted successfully'}), 200
        else:
            return jsonify({'message': 'Document not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@app.route('/user-list', defaults={'path': ''})
@app.route('/user-list/<path:path>')
@verify_token
def serve(path, **kwargs):
    decoded_token = kwargs.get('decoded_token')
    if decoded_token and decoded_token.get('role') == 'superadmin':
        if path == "":
            return send_from_directory('build', 'index.html')
        elif os.path.exists(os.path.join('build', path)):
            return send_from_directory('build', path)
        else:
            return send_from_directory('build', 'index.html')
    else:
        abort(404) 

@app.route('/api/user-list', methods=['GET', 'PUT'])
@verify_token
def user_list(**kwargs):
    decoded_token = kwargs.get('decoded_token')
    if decoded_token and decoded_token.get('role') == 'superadmin':
        if request.method == 'GET':
            current_user_id = decoded_token.get('user_id')  
            users = list(collection.find({'_id': {'$ne': ObjectId(current_user_id)}}, {'username': 1, 'active': 1}))
            for user in users:
                user['_id'] = str(user['_id'])
            return jsonify(users), 200
        elif request.method == 'PUT':
            data = request.json
            user_id = data.get('id') 
            new_active_status = data.get('active')
            collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'active': new_active_status}})
            return jsonify({'message': 'User status updated successfully'}), 200
    else:
        return jsonify({'message': 'Permission denied'}), 403



@app.errorhandler(404)
def page_not_found(e):
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

