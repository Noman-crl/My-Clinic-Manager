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
  CircularProgress,
  Alert,
} from '@mui/material';
import { getDoctor, createDoctor, updateDoctor } from '../../services/supabaseApi';

const validationSchema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  specialization: yup.string().required('Specialization is required'),
  license_number: yup.string().required('License number is required'),
  experience: yup.number().required('Experience is required').min(0, 'Experience must be positive'),
  consultation_fee: yup.number().required('Consultation fee is required').min(0, 'Fee must be positive'),
});

const DoctorForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      specialization: '',
      license_number: '',
      experience: 0,
      consultation_fee: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        if (isEdit && id) {
          await updateDoctor(id, values);
        } else {
          await createDoctor(values);
        }
        navigate('/doctors');
      } catch (err) {
        setError('Failed to save doctor. Please try again later.');
        console.error('Error saving doctor:', err);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      if (isEdit && id) {
        try {
          setLoading(true);
          const doctor = await getDoctor(id);
          formik.setValues({
            first_name: doctor.first_name,
            last_name: doctor.last_name,
            email: doctor.email,
            phone: doctor.phone,
            specialization: doctor.specialization,
            license_number: doctor.license_number,
            experience: doctor.experience,
            consultation_fee: doctor.consultation_fee,
          });
        } catch (err) {
          setError('Failed to fetch doctor details. Please try again later.');
          console.error('Error fetching doctor:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDoctor();
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
        {isEdit ? 'Edit Doctor' : 'Add New Doctor'}
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
                id="first_name"
                name="first_name"
                label="First Name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="last_name"
                name="last_name"
                label="Last Name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                helperText={formik.touched.last_name && formik.errors.last_name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="specialization"
                name="specialization"
                label="Specialization"
                value={formik.values.specialization}
                onChange={formik.handleChange}
                error={formik.touched.specialization && Boolean(formik.errors.specialization)}
                helperText={formik.touched.specialization && formik.errors.specialization}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="license_number"
                name="license_number"
                label="License Number"
                value={formik.values.license_number}
                onChange={formik.handleChange}
                error={formik.touched.license_number && Boolean(formik.errors.license_number)}
                helperText={formik.touched.license_number && formik.errors.license_number}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="experience"
                name="experience"
                label="Years of Experience"
                type="number"
                value={formik.values.experience}
                onChange={formik.handleChange}
                error={formik.touched.experience && Boolean(formik.errors.experience)}
                helperText={formik.touched.experience && formik.errors.experience}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="consultation_fee"
                name="consultation_fee"
                label="Consultation Fee"
                type="number"
                value={formik.values.consultation_fee}
                onChange={formik.handleChange}
                error={formik.touched.consultation_fee && Boolean(formik.errors.consultation_fee)}
                helperText={formik.touched.consultation_fee && formik.errors.consultation_fee}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/doctors')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : (isEdit ? 'Update' : 'Save')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default DoctorForm;