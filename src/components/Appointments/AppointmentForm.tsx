import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';

const validationSchema = yup.object({
  patient_id: yup.string().required('Patient is required'),
  doctor_id: yup.string().required('Doctor is required'),
  appointment_date: yup.date().required('Date is required'),
  appointment_time: yup.string().required('Time is required'),
  reason: yup.string().required('Reason is required'),
  status: yup.string().required('Status is required'),
});

// Mock data
const mockPatients = [
  { id: '1', first_name: 'Alice', last_name: 'Brown', email: 'alice.brown@email.com', phone: '+1-555-0201' },
  { id: '2', first_name: 'Michael', last_name: 'Davis', email: 'michael.davis@email.com', phone: '+1-555-0203' },
  { id: '3', first_name: 'Emma', last_name: 'Thompson', email: 'emma.thompson@email.com', phone: '+1-555-0205' },
];

const mockDoctors = [
  { id: '1', first_name: 'John', last_name: 'Smith', specialization: 'Cardiology' },
  { id: '2', first_name: 'Sarah', last_name: 'Johnson', specialization: 'Pediatrics' },
  { id: '3', first_name: 'Michael', last_name: 'Brown', specialization: 'Orthopedics' },
];

const AppointmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      patient_id: '',
      doctor_id: '',
      appointment_date: '',
      appointment_time: '',
      reason: '',
      status: 'scheduled',
      notes: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Appointment saved:', values);
        navigate('/appointments');
      } catch (err) {
        setError('Failed to save appointment. Please try again later.');
        console.error('Error saving appointment:', err);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      // Mock loading existing appointment data
      setLoading(true);
      setTimeout(() => {
        formik.setValues({
          patient_id: '1',
          doctor_id: '1',
          appointment_date: '2024-01-15',
          appointment_time: '10:00',
          reason: 'Regular checkup',
          status: 'scheduled',
          notes: 'Patient requested morning appointment',
        });
        setLoading(false);
      }, 500);
    }
  }, [id, isEdit]);

  if (loading && isEdit) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Appointment' : 'Schedule New Appointment'}
      </Typography>
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="patient_id"
                name="patient_id"
                select
                label="Patient"
                value={formik.values.patient_id}
                onChange={formik.handleChange}
                error={formik.touched.patient_id && Boolean(formik.errors.patient_id)}
                helperText={formik.touched.patient_id && formik.errors.patient_id}
              >
                {mockPatients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="doctor_id"
                name="doctor_id"
                select
                label="Doctor"
                value={formik.values.doctor_id}
                onChange={formik.handleChange}
                error={formik.touched.doctor_id && Boolean(formik.errors.doctor_id)}
                helperText={formik.touched.doctor_id && formik.errors.doctor_id}
              >
                {mockDoctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="appointment_date"
                name="appointment_date"
                label="Date"
                type="date"
                value={formik.values.appointment_date}
                onChange={formik.handleChange}
                error={formik.touched.appointment_date && Boolean(formik.errors.appointment_date)}
                helperText={formik.touched.appointment_date && formik.errors.appointment_date}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="appointment_time"
                name="appointment_time"
                label="Time"
                type="time"
                value={formik.values.appointment_time}
                onChange={formik.handleChange}
                error={formik.touched.appointment_time && Boolean(formik.errors.appointment_time)}
                helperText={formik.touched.appointment_time && formik.errors.appointment_time}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="status"
                name="status"
                select
                label="Status"
                value={formik.values.status}
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
              >
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="no-show">No Show</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="reason"
                name="reason"
                label="Reason for Visit"
                value={formik.values.reason}
                onChange={formik.handleChange}
                error={formik.touched.reason && Boolean(formik.errors.reason)}
                helperText={formik.touched.reason && formik.errors.reason}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Notes"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/appointments')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : (isEdit ? 'Update' : 'Schedule')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AppointmentForm;