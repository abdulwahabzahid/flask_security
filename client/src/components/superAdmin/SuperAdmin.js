import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import SimpleSidebar from '../chakra/SimpleSidebar';

const SuperAdmin = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; 
  };

  return (
    <SimpleSidebar>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh" 
        mx="auto"
        p={6} 
        bg="white" 
      >
        <Box maxW="md" p={6} borderWidth="1px" borderRadius="md" textAlign="center">
          <Heading as="h2" size="xl" mb={4}>
            Super Admin Dashboard
          </Heading>
          <Text mb={4}>
            Welcome to the Super Admin dashboard. You have full access to all features and settings.
          </Text>
          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
    </SimpleSidebar>
  );
};

export default SuperAdmin;
