import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Heading,
  Text,
  Stack,
  Center,
  CircularProgress,
  Switch,
  Button
} from '@chakra-ui/react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    try {
      const response = await axios.get(`${apiUrl}/api/user-list`);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      setError('Failed to fetch users');
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    const apiUrl = process.env.REACT_APP_API_URL;

    try {
      const response = await axios.put(`${apiUrl}/api/user-list`, {
        id: userId,
        active: isActive === 'true' ? 'false' : 'true', // Toggle the active status
      });
      console.log(response.data.message);
      fetchUsers(); // Refresh the user list after update
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Failed to update user status');
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Box>
      <Button mb={4} onClick={handleBack}>
        Back
      </Button>
      <Heading as="h2" size="xl" mb={6}>
        User List
      </Heading>
      {loading ? (
        <Center mt={8}>
          <CircularProgress isIndeterminate color="blue.300" />
        </Center>
      ) : error ? (
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      ) : (
        <Stack spacing={4}>
          {users.map((user) => (
            <Box key={user._id} borderWidth="1px" p={4}>
              <Text fontSize="xl">{user.username}</Text>
              <Stack direction="row" align="center" mt={2}>
                <Text>{`Active: ${user.active}`}</Text>
                <Switch
                  isChecked={user.active === 'true'}
                  onChange={() => handleToggleActive(user._id, user.active)}
                />
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default UserList;
