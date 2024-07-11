import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        username,
        password,
      },
    );
      const token = response.data.token;
      localStorage.setItem('token', token);
      Cookies.set('token', `Bearer ${token}`);
      const userRole = jwtDecode(token).role;
      // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;


      switch (userRole) {
        case 'user':
          window.location.href = '/user';
          break;
        case 'admin':
          window.location.href = '/admin';
          break;
        case 'superadmin':
          window.location.href = '/superadmin';
          break;
        default:
          setMessage('Unknown role');
      }
    } catch (error) {
      setMessage('Login failed');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="md">
      <Heading as="h2" size="xl" textAlign="center" mb={6}>
        Login
      </Heading>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleLogin}>
          Login
        </Button>
        {message && (
          <Text color="red.500" textAlign="center">
            {message}
          </Text>
        )}
      </Stack>
    </Box>
  );
}

export default Login;
