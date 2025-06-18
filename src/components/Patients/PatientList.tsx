import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

// Mock data
const mockPatients = [
  {
    id: '1',
    first_name: 'Alice',
    last_name: 'Brown',
    email: 'alice.brown@email.com',
    phone: '+1-555-0201',
    date_of_birth: '1985-03-15',
    gender: 'female',
    address: '123 Main St, New York, NY 10001',
    emergency_contact: 'Bob Brown',
    emergency_phone: '+1-555-0202',
    insurance_number: 'INS001'
  },
  {
    id: '2',
    first_name: 'Michael',
    last_name: 'Davis',
    email: 'michael.davis@email.com',
    phone: '+1-555-0203',
    date_of_birth: '1978-07-22',
    gender: 'male',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    emergency_contact: 'Lisa Davis',
    emergency_phone: '+1-555-0204',
    insurance_number: 'INS002'
  },
  {
    id: '3',
    first_name: 'Emma',
    last_name: 'Thompson',
    email: 'emma.thompson@email.com',
    phone: '+1-555-0205',
    date_of_birth: '2010-12-08',
    gender: 'female',
    address: '789 Pine St, Chicago, IL 60601',
    emergency_contact: 'James Thompson',
    emergency_phone: '+1-555-0206',
    insurance_number: 'INS003'
  }
];

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(mockPatients);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleDeletePatient = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        setPatients(prev => prev.filter(patient => patient.id !== id));
      } catch (err) {
        setError('Failed to delete patient. Please try again later.');
        console.error('Error deleting patient:', err);
      }
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Patient Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/patients/new')}
        >
          Add Patient
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search patients by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Insurance</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {patient.first_name} {patient.last_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {patient.id.slice(-6)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{patient.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{patient.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {calculateAge(patient.date_of_birth)} years
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={patient.gender}
                      size="small"
                      color={patient.gender === 'male' ? 'primary' : patient.gender === 'female' ? 'secondary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {patient.insurance_number || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/patients/${patient.id}`)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/patients/${patient.id}`)}
                        color="success"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePatient(patient.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default PatientList;