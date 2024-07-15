import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Heading,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const DocumentService = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [newDocumentContent, setNewDocumentContent] = useState('');
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeePosition, setNewEmployeePosition] = useState('');
  const [newEmployeeDepartment, setNewEmployeeDepartment] = useState('');
  const [role, setRole] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmAdd, setConfirmAdd] = useState(false);
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      const apiUrl = process.env.REACT_APP_API_URL;
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
        const response = await axios.get(`${apiUrl}/document-service`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocuments(response.data);
        console.log('Fetched documents:', response.data);
      } catch (err) {
        setError('Failed to fetch documents.');
      }
    };

    fetchService();
  }, []);

  const handleEditDocument = async (id) => {
    setConfirmEdit(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${apiUrl}/document-service`,
        { id, content: newDocumentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDocuments(documents.map((doc) => (doc._id === id ? { ...doc, content: newDocumentContent } : doc)));
    } catch (err) {
      setError('Failed to edit document.');
    }
  };

  const handleDeleteDocument = async (id) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiUrl}/document-service/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(documents.filter((doc) => doc._id !== id));
      setConfirmDelete(false);
      setDeleteId(null);
    } catch (err) {
      setError('Failed to delete document.');
    }
  };

  const handleAddDocument = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const token = localStorage.getItem('token');
      const newDocument = {
        id: documents.length + 1,
        title: newDocumentTitle,
        content: newDocumentContent,
        name: newEmployeeName,
        position: newEmployeePosition,
        department: newEmployeeDepartment,
      };
      setConfirmAdd(false);
      const response = await axios.put(`${apiUrl}/document-service`, newDocument, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments([...documents, response.data]);
      setNewDocumentTitle('');
      setNewDocumentContent('');
      setNewEmployeeName('');
      setNewEmployeePosition('');
      setNewEmployeeDepartment('');
    } catch (err) {
      setError('Failed to add document.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const onCloseDeleteDialog = () => {
    setConfirmDelete(false);
    setDeleteId(null);
  };

  const onDeleteDocument = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  const onCloseEditDialog = () => {
    setConfirmEdit(false);
    setEditId(null);
  };

  const onEditDocument = (id) => {
    setEditId(id);
    setConfirmEdit(true);
  };

  const handleConfirmEdit = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${apiUrl}/document-service`,
        { id: editId, content: newDocumentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDocuments(documents.map((doc) => (doc._id === editId ? { ...doc, content: newDocumentContent } : doc)));
      setConfirmEdit(false);
      setEditId(null);
    } catch (err) {
      setError('Failed to edit document.');
    }
  };

  const handleEditContentChange = (id, value) => {
    setNewDocumentContent(value);
  };

  return (
    <Box mt={5} px={4}>
      <Button mb={4} onClick={handleBack} colorScheme="blue">
        Back
      </Button>
      <Heading as="h2" size="lg" mb={4}>
        Employee Information
      </Heading>
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Description</Th>
            <Th>Employee Name</Th>
            <Th>Employee Position</Th>
            <Th>Employee Department</Th>
            {(role === 'admin' || role === 'superadmin') && <Th>Action</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {documents.map((doc) => (
            <Tr key={doc._id}>
              <Td>{doc.title}</Td>
              <Td>{doc.content}</Td>
              <Td>{doc.name}</Td>
              <Td>{doc.position}</Td>
              <Td>{doc.department}</Td>
              {(role === 'admin' || role === 'superadmin') && (
                <Td>
                  <VStack spacing={2}>
                    <Input
                      placeholder="Description"
                      value={newDocumentContent}
                      onChange={(e) => handleEditContentChange(doc._id, e.target.value)}
                    />
                    <Button
                      onClick={() => onEditDocument(doc._id)}
                      colorScheme="teal"
                      size="sm"
                      disabled={!newDocumentContent}
                    >
                      Edit
                    </Button>
                    <Button onClick={() => onDeleteDocument(doc._id)} colorScheme="red" size="sm">
                      Delete
                    </Button>
                  </VStack>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
      {role === 'superadmin' && (
        <Box mt={6}>
          <Heading as="h3" size="md" mb={4}>
            Add New Document
          </Heading>
          <Table variant="striped" colorScheme="gray" size="sm">
            <Tbody>
              <Tr>
                <Td>
                  <Input
                    placeholder="Title"
                    value={newDocumentTitle}
                    onChange={(e) => setNewDocumentTitle(e.target.value)}
                  />
                </Td>
                <Td>
                  <Input
                    placeholder="Description"
                    value={newDocumentContent}
                    onChange={(e) => setNewDocumentContent(e.target.value)}
                  />
                </Td>
                <Td>
                  <Input
                    placeholder="Name"
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}
                  />
                </Td>
                <Td>
                  <Input
                    placeholder="Position"
                    value={newEmployeePosition}
                    onChange={(e) => setNewEmployeePosition(e.target.value)}
                  />
                </Td>
                <Td>
                  <Input
                    placeholder="Department"
                    value={newEmployeeDepartment}
                    onChange={(e) => setNewEmployeeDepartment(e.target.value)}
                  />
                </Td>
                <Td>
                  <Button onClick={handleAddDocument} colorScheme="green" size="sm">
                    Add Document
                  </Button>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      )}
      <AlertDialog
        isOpen={confirmDelete}
        leastDestructiveRef={undefined}
        onClose={onCloseDeleteDialog}
        motionPreset="slideInBottom"
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete Document</AlertDialogHeader>
          <AlertDialogBody>Are you sure you want to delete this document?</AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onCloseDeleteDialog}>Cancel</Button>
            <Button colorScheme="red" onClick={() => handleDeleteDocument(deleteId)} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        isOpen={confirmEdit}
        leastDestructiveRef={undefined}
        onClose={onCloseEditDialog}
        motionPreset="slideInBottom"
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Edit Document</AlertDialogHeader>
          <AlertDialogBody>Are you sure you want to edit this document?</AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onCloseEditDialog}>Cancel</Button>
            <Button colorScheme="teal" onClick={handleConfirmEdit} ml={3}>
              Edit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default DocumentService;
