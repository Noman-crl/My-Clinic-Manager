import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  Event as AppointmentIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // TODO: Fetch stats from API
  const stats = [
    {
      title: 'Total Patients',
      value: 0,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      onClick: () => navigate('/patients'),
    },
    {
      title: 'Total Doctors',
      value: 0,
      icon: <DoctorIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      onClick: () => navigate('/doctors'),
    },
    {
      title: "Today's Appointments",
      value: 0,
      icon: <AppointmentIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      onClick: () => navigate('/appointments?filter=today'),
    },
    {
      title: 'Pending Appointments',
      value: 0,
      icon: <AppointmentIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      onClick: () => navigate('/appointments?filter=pending'),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat) => (
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
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 6, backgroundColor: '#f0f4ff' },
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
              <Typography color="text.secondary" variant="subtitle1">
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