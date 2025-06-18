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
  TablePagination,
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
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { getAppointments, cancelAppointment } from '../../services/api';

interface Appointment {
  _id: string;
  patientId: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  doctorId: {
    firstName: string;
    lastName: string;
    specialization: string;
  };
  date: string;
  time: string;
  type: string;
  reason: string;
  status: string;
  priority: string;
}

const AppointmentList: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchAppointments();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getAppointments({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        status: statusFilter,
      });
      setAppointments(response.data.appointments || []);
      setTotalCount(response.data.total || 0);
      setError('');
    } catch (err) {
      setError('Failed to fetch appointments. Please try again later.');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment(id, {
          cancelledBy: 'admin',
          cancellationReason: 'Cancelled by admin'
        });
        fetchAppointments();
      } catch (err) {
        setError('Failed to cancel appointment. Please try again later.');
        console.error('Error cancelling appointment:', err);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'primary';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && appointments.length === 0) {
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
                <TableCell>Type</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment._id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {appointment.patientId.firstName} {appointment.patientId.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.patientId.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.doctorId.specialization}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {new Date(appointment.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.time}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.type}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                      {appointment.reason}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={appointment.priority}
                      size="small"
                      color={getPriorityColor(appointment.priority) as any}
                    />
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
                        onClick={() => navigate(`/appointments/${appointment._id}`)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/appointments/${appointment._id}`)}
                        color="success"
                      >
                        <EditIcon />
                      </IconButton>
                      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <IconButton
                          size="small"
                          onClick={() => handleCancelAppointment(appointment._id)}
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default AppointmentList;