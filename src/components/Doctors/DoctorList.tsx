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
const mockDoctors = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@clinic.com',
    phone: '+1-555-0101',
    specialization: 'Cardiology',
    license_number: 'MD001',
    experience: 15,
    consultation_fee: 200,
    is_active: true
  },
  {
    id: '2',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@clinic.com',
    phone: '+1-555-0102',
    specialization: 'Pediatrics',
    license_number: 'MD002',
    experience: 12,
    consultation_fee: 180,
    is_active: true
  },
  {
    id: '3',
    first_name: 'Michael',
    last_name: 'Brown',
    email: 'michael.brown@clinic.com',
    phone: '+1-555-0103',
    specialization: 'Orthopedics',
    license_number: 'MD003',
    experience: 18,
    consultation_fee: 250,
    is_active: true
  }
];

const DoctorList: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState(mockDoctors);
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

  const handleDeleteDoctor = async (id: string) => {
    if (window.confirm('Are you sure you want to deactivate this doctor?')) {
      try {
        setDoctors(prev => prev.map(doctor => 
          doctor.id === id ? { ...doctor, is_active: false } : doctor
        ));
      } catch (err) {
        setError('Failed to deactivate doctor. Please try again later.');
        console.error('Error deactivating doctor:', err);
      }
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.license_number.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Typography variant="h4">Doctor Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/doctors/new')}
        >
          Add Doctor
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
          placeholder="Search doctors by name, email, specialization, or license number..."
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
                <TableCell>Doctor</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell>Fee</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Dr. {doctor.first_name} {doctor.last_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        License: {doctor.license_number}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{doctor.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{doctor.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{doctor.specialization}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{doctor.experience} years</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">${doctor.consultation_fee}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={doctor.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      color={doctor.is_active ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/doctors/${doctor.id}`)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/doctors/${doctor.id}`)}
                        color="success"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteDoctor(doctor.id)}
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

export default DoctorList;