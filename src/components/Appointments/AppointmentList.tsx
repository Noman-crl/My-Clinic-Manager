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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

// Mock data
const mockAppointments = [
  {
    id: '1',
    patient_id: '1',
    doctor_id: '1',
    appointment_date: '2024-01-15',
    appointment_time: '10:00',
    reason: 'Regular checkup',
    status: 'scheduled',
    notes: 'Patient requested morning appointment',
    patients: { first_name: 'Alice', last_name: 'Brown', phone: '+1-555-0201' },
    doctors: { first_name: 'John', last_name: 'Smith', specialization: 'Cardiology' }
  },
  {
    id: '2',
    patient_id: '2',
    doctor_id: '2',
    appointment_date: '2024-01-16',
    appointment_time: '14:00',
    reason: 'Pediatric checkup',
    status: 'confirmed',
    notes: '',
    patients: { first_name: 'Emma', last_name: 'Thompson', phone: '+1-555-0205' },
    doctors: { first_name: 'Sarah', last_name: 'Johnson', specialization: 'Pediatrics' }
  },
  {
    id: '3',
    patient_id: '3',
    doctor_id: '3',
    appointment_date: '2024-01-17',
    appointment_time: '09:30',
    reason: 'Knee pain consultation',
    status: 'completed',
    notes: 'Follow-up required',
    patients: { first_name: 'Michael', last_name: 'Davis', phone: '+1-555-0203' },
    doctors: { first_name: 'Michael', last_name: 'Brown', specialization: 'Orthopedics' }
  }
];

const AppointmentList: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(mockAppointments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        setAppointments(prev => prev.filter(apt => apt.id !== id));
      } catch (err) {
        setError('Failed to delete appointment. Please try again later.');
        console.error('Error deleting appointment:', err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'confirmed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'no-show':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = searchTerm === '' || 
      (appointment.patients && 
        `${appointment.patients.first_name} ${appointment.patients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (appointment.doctors && 
        `${appointment.doctors.first_name} ${appointment.doctors.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
        <Typography variant="h4">Appointment Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/appointments/new')}
        >
          Schedule Appointment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="no-show">No Show</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {appointment.patients ? 
                          `${appointment.patients.first_name} ${appointment.patients.last_name}` : 
                          'Unknown Patient'
                        }
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.patients?.phone || 'No phone'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {appointment.doctors ? 
                          `Dr. ${appointment.doctors.first_name} ${appointment.doctors.last_name}` : 
                          'Unknown Doctor'
                        }
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.doctors?.specialization || 'No specialization'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.appointment_time}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                      {appointment.reason}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.status}
                      size="small"
                      color={getStatusColor(appointment.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/appointments/${appointment.id}`)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/appointments/${appointment.id}`)}
                        color="success"
                      >
                        <EditIcon />
                      </IconButton>
                      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          color="error"
                        >
                          <CancelIcon />
                        </IconButton>
                      )}
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

export default AppointmentList;