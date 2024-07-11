import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

const User = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirect to the login page
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="md" textAlign="center">
      <Heading as="h2" size="xl" mb={4}>
        User Dashboard
      </Heading>
      <Text mb={4}>
        Welcome to the User dashboard. You can view and manage your account here.
      </Text>
      <Button colorScheme="red" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default User;
