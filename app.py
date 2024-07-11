import os
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import jwt
from jwt import decode as jwt_decode
import datetime
from dotenv import load_dotenv
from pymongo import MongoClient
from bson.objectid import ObjectId  

load_dotenv()

app = Flask(__name__, static_folder='client/build', static_url_path='')
cors_origins = os.getenv('CORS_ORIGINS')
CORS(app, origins="")
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SESSION_TYPE'] = 'filesystem'  

# MongoDB connection setup
mongo_uri = os.getenv('MONGO_URI')
client = MongoClient(mongo_uri)
db = client['db1']
collection = db['credentials']

# Define a decorator to check JWT token
def verify_token(func):
    def wrapper(*args, **kwargs):
        auth_cookie = request.cookies.get('token')  
        print("HERE IS THE TOKEN")
        print(auth_cookie)
        if auth_cookie:
            token_parts = auth_cookie.split("%20")
            if len(token_parts) == 2 and token_parts[0] == 'Bearer':  # Ensure correct format 'Bearer <token>'
                token = token_parts[1]  # Extract token from cookie
                try:
                    decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
                    kwargs['decoded_token'] = decoded_token  # Pass decoded token to the view function
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
        token = jwt.encode({
            'user_id': str(user['_id']), 
            'username': username,
            'role': user['role'],
            'exp': datetime.datetime.now() + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'])

        # Print token information
        print(f"Generated token for {username}: {token}")
        return jsonify({'token': token})
    return jsonify({'message': 'Invalid credentials'}), 401

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
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/superadmin', methods=['GET'])
@verify_token
def super_admin_page(**kwargs):
    decoded_token = kwargs.get('decoded_token')
    print(decoded_token)
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def page_not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
