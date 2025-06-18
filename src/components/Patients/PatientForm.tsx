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
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  date_of_birth: yup.date().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  address: yup.string().required('Address is required'),
  emergency_contact: yup.string().required('Emergency contact is required'),
  emergency_phone: yup.string().required('Emergency phone is required'),
});

const PatientForm: React.FC = () => {
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
      date_of_birth: '',
      gender: 'male',
      address: '',
      emergency_contact: '',
      emergency_phone: '',
      insurance_number: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Patient saved:', values);
        navigate('/patients');
      } catch (err) {
        setError('Failed to save patient. Please try again later.');
        console.error('Error saving patient:', err);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      // Mock loading existing patient data
      setLoading(true);
      setTimeout(() => {
        formik.setValues({
          first_name: 'Alice',
          last_name: 'Brown',
          email: 'alice.brown@email.com',
          phone: '+1-555-0201',
          date_of_birth: '1985-03-15',
          gender: 'female',
          address: '123 Main St, New York, NY 10001',
          emergency_contact: 'Bob Brown',
          emergency_phone: '+1-555-0202',
          insurance_number: 'INS001',
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
        {isEdit ? 'Edit Patient' : 'Add New Patient'}
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
                id="date_of_birth"
                name="date_of_birth"
                label="Date of Birth"
                type="date"
                value={formik.values.date_of_birth}
                onChange={formik.handleChange}
                error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
                helperText={formik.touched.date_of_birth && formik.errors.date_of_birth}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="gender"
                name="gender"
                select
                label="Gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                helperText={formik.touched.gender && formik.errors.gender}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Address"
                multiline
                rows={3}
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="emergency_contact"
                name="emergency_contact"
                label="Emergency Contact Name"
                value={formik.values.emergency_contact}
                onChange={formik.handleChange}
                error={formik.touched.emergency_contact && Boolean(formik.errors.emergency_contact)}
                helperText={formik.touched.emergency_contact && formik.errors.emergency_contact}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="emergency_phone"
                name="emergency_phone"
                label="Emergency Contact Phone"
                value={formik.values.emergency_phone}
                onChange={formik.handleChange}
                error={formik.touched.emergency_phone && Boolean(formik.errors.emergency_phone)}
                helperText={formik.touched.emergency_phone && formik.errors.emergency_phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="insurance_number"
                name="insurance_number"
                label="Insurance Number (Optional)"
                value={formik.values.insurance_number}
                onChange={formik.handleChange}
                error={formik.touched.insurance_number && Boolean(formik.errors.insurance_number)}
                helperText={formik.touched.insurance_number && formik.errors.insurance_number}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/patients')}
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

export default PatientForm;