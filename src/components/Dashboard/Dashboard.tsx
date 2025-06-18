import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import {
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  Event as AppointmentIcon,
  Receipt as InvoiceIcon,
} from '@mui/icons-material';
import { getDashboardStats } from '../../services/api';

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  pendingAppointments: number;
  monthlyRevenue: number;
  pendingInvoices: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      setStats(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      onClick: () => navigate('/patients'),
    },
    {
      title: 'Total Doctors',
      value: stats?.totalDoctors || 0,
      icon: <DoctorIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      onClick: () => navigate('/doctors'),
    },
    {
      title: "Today's Appointments",
      value: stats?.todayAppointments || 0,
      icon: <AppointmentIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      onClick: () => navigate('/appointments?filter=today'),
    },
    {
      title: 'Pending Appointments',
      value: stats?.pendingAppointments || 0,
      icon: <AppointmentIcon sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      onClick: () => navigate('/appointments?filter=pending'),
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats?.monthlyRevenue?.toFixed(2) || '0.00'}`,
      icon: <InvoiceIcon sx={{ fontSize: 40 }} />,
      color: '#7b1fa2',
      onClick: () => navigate('/billing'),
    },
    {
      title: 'Pending Invoices',
      value: stats?.pendingInvoices || 0,
      icon: <InvoiceIcon sx={{ fontSize: 40 }} />,
      color: '#f57c00',
      onClick: () => navigate('/billing?filter=pending'),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {statCards.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  boxShadow: 6, 
                  backgroundColor: '#f8f9fa',
                  transform: 'translateY(-2px)'
                },
              }}
              onClick={stat.onClick}
            >
              <Box
                sx={{
                  color: stat.color,
                  mb: 2,
                }}
              >
                {stat.icon}
              </Box>
              <Typography variant="h4" component="div" gutterBottom>
                {stat.value}
              </Typography>
              <Typography color="text.secondary" variant="subtitle1" textAlign="center">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;