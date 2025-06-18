import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  Event as AppointmentIcon,
  Description as MedicalRecordsIcon,
  Receipt as BillingIcon,
  Assessment as ReportsIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
  { text: 'Doctors', icon: <DoctorIcon />, path: '/doctors' },
  { text: 'Appointments', icon: <AppointmentIcon />, path: '/appointments' },
  { text: 'Medical Records', icon: <MedicalRecordsIcon />, path: '/medical-records' },
  { text: 'Billing', icon: <BillingIcon />, path: '/billing' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', mt: 1 }}>
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" color="text.secondary" fontWeight="bold">
            Main Menu
          </Typography>
        </Box>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 1,
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 'bold' : 'normal',
                  }}
                />
              </ListItem>
            );
          })}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Ultimate Clinic v1.0
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;