import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon } from '@mui/icons-material';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'phone', headerName: 'Phone', width: 150 },
  { field: 'specialization', headerName: 'Specialization', width: 200 },
  { field: 'experience', headerName: 'Experience (years)', width: 150 },
  { field: 'status', headerName: 'Status', width: 120 },
];

const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Sarah Smith',
    email: 'sarah@example.com',
    phone: '123-456-7890',
    specialization: 'Cardiology',
    experience: 10,
    status: 'Active',
  },
  // Add more mock data as needed
];

const DoctorList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Doctors</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/doctors/new')}
        >
          Add Doctor
        </Button>
      </Box>
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={mockDoctors}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          onRowClick={(params) => navigate(`/doctors/${params.row.id}`)}
        />
      </Paper>
    </Box>
  );
};

export default DoctorList; 