import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

const Admin = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    // Redirect to the login page or any other desired action after logout
    window.location.href = '/'; // Redirect to the login page
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="md" textAlign="center">
      <Heading as="h2" size="xl" mb={4}>
        Admin Dashboard
      </Heading>
      <Text mb={4}>
        Welcome to the Admin dashboard. You have access to manage users and settings.
      </Text>
      <Button colorScheme="red" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default Admin;
