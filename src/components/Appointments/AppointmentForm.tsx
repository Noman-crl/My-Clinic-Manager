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
import { 
  getAppointment, 
  createAppointment, 
  updateAppointment,
  getPatients,
  getDoctors 
} from '../../services/supabaseApi';
import type { Patient, Doctor } from '../../lib/supabase';

const validationSchema = yup.object({
  patient_id: yup.string().required('Patient is required'),
  doctor_id: yup.string().required('Doctor is required'),
  appointment_date: yup.date().required('Date is required'),
  appointment_time: yup.string().required('Time is required'),
  reason: yup.string().required('Reason is required'),
  status: yup.string().required('Status is required'),
});

const AppointmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

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
        if (isEdit && id) {
          await updateAppointment(id, values);
        } else {
          await createAppointment(values);
        }
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientsData, doctorsData] = await Promise.all([
          getPatients(),
          getDoctors()
        ]);
        setPatients(patientsData);
        setDoctors(doctorsData);

        if (isEdit && id) {
          const appointment = await getAppointment(id);
          formik.setValues({
            patient_id: appointment.patient_id,
            doctor_id: appointment.doctor_id,
            appointment_date: appointment.appointment_date,
            appointment_time: appointment.appointment_time,
            reason: appointment.reason,
            status: appointment.status,
            notes: appointment.notes || '',
          });
        }
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit]);

  if (loading && (patients.length === 0 || doctors.length === 0)) {
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
                {patients.map((patient) => (
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
                {doctors.map((doctor) => (
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