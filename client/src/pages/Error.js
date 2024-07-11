import React from 'react';
import { Button, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
    const navigate = useNavigate()
  const navigateToHome = () => {
    console.log("clicked")
    navigate('/')
  };

  return (
    <VStack spacing={4} align="center" mt={20}>
      <Heading as="h1" size="xl">
        404 - Not Found
      </Heading>
      <Text fontSize="lg" textAlign="center">
        The page you are looking for does not exist.
      </Text>
      <Button colorScheme="blue" onClick={navigateToHome}>
        Go Back Home
      </Button>
    </VStack>
  );
};

export default Error;
