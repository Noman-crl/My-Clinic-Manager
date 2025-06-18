import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  Event as AppointmentIcon,
  Receipt as InvoiceIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for demo
  const stats = {
    totalPatients: 150,
    totalDoctors: 12,
    todayAppointments: 8,
    totalRevenue: 25000
  };

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      onClick: () => navigate('/patients'),
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: <DoctorIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      onClick: () => navigate('/doctors'),
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: <AppointmentIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      onClick: () => navigate('/appointments'),
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: <InvoiceIcon sx={{ fontSize: 40 }} />,
      color: '#7b1fa2',
      onClick: () => navigate('/billing'),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {statCards.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
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