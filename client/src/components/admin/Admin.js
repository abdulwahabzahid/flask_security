import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import SimpleSidebar from '../chakra/SimpleSidebar';

const Admin = () => {
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
        height="calc(100vh - 80px)" 
        mx="auto" 
        p={6}
        bg="white" 
      >
        <Box textAlign="center">
          <Heading as="h2" size="xl" mb={4}>
            Admin Dashboard
          </Heading>
          <Text fontSize="lg" mb={4}>
            Welcome to the Admin dashboard. You have access to manage users and settings.
          </Text>
          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
    </SimpleSidebar>
  );
};

export default Admin;
