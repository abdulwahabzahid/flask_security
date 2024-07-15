import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Assuming correct import path for jwt-decode
import { Box, Flex, Text } from '@chakra-ui/react';

const Navbar = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username); // Set the username from decoded token
    }
  }, []);

  return (
    <Box
      bg="blue.500"
      px={4}
      py={3}
      position="sticky"
      top="0"
      zIndex="sticky"
      boxShadow="sm"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Link to="/">
          <Text fontSize="xl" fontWeight="bold" color="white">
            Quest App
          </Text>
        </Link>
        <Text fontSize="md" color="white">
          Welcome, {username}
        </Text>
      </Flex>
    </Box>
  );
};

export default Navbar;
