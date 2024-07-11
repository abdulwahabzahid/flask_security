import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

const SuperAdmin = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirect to the login page
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="md" textAlign="center">
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
  );
};

export default SuperAdmin;
