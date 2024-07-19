import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import Login from './pages/Login';
import User from './components/user/User';
import Admin from './components/admin/Admin';
import SuperAdmin from './components/superAdmin/SuperAdmin';
import Error from './pages/Error';
import DocumentService from './pages/Documents';
import ProtectedRoute from './pages/ProtectedRoute'; 
import UserList from './pages/UserList';

const getDecodedToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
  return null;
};

const isLoggedIn = () => {
  const decodedToken = getDecodedToken();
  return decodedToken !== null;
};

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Container maxW="container.lg" mt={10}>
          <Routes>
            <Route
              path="/"
              element={isLoggedIn() ? <Navigate to={`/${getDecodedToken().role}`} replace /> : <Login />}
            />
            <Route element={<ProtectedRoute role="user" />}>
              <Route path="/user" element={<User />} />
            </Route>
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
            <Route element={<ProtectedRoute role="superadmin" />}>
              <Route path="/superadmin" element={<SuperAdmin />} />
              <Route path="/user-list" element={<UserList />} />

            </Route>
            <Route path="/documents" element={<DocumentService />} />
            
            <Route path="/user-list" element={<UserList />} /> 

            <Route path="*" element={<Error />} />

          </Routes>
        </Container>
      </Router>
    </ChakraProvider>
  );
}

export default App;
