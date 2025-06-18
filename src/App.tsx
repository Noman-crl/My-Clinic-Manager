import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import PatientList from './components/Patients/PatientList';
import PatientForm from './components/Patients/PatientForm';
import DoctorList from './components/Doctors/DoctorList';
import DoctorForm from './components/Doctors/DoctorForm';
import AppointmentList from './components/Appointments/AppointmentList';
import AppointmentForm from './components/Appointments/AppointmentForm';
import MedicalRecordsList from './components/MedicalRecords/MedicalRecordsList';
import BillingList from './components/Billing/BillingList';
import Reports from './components/Reports/Reports';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/signin" replace />;
  return <Layout>{children}</Layout>;
}

function PublicHome() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (user) return <Navigate to="/dashboard" replace />;
  return <Home />;
}

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicHome />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Patient Routes */}
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <PatientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/new"
              element={
                <ProtectedRoute>
                  <PatientForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/:id"
              element={
                <ProtectedRoute>
                  <PatientForm />
                </ProtectedRoute>
              }
            />
            
            {/* Doctor Routes */}
            <Route
              path="/doctors"
              element={
                <ProtectedRoute>
                  <DoctorList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors/new"
              element={
                <ProtectedRoute>
                  <DoctorForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors/:id"
              element={
                <ProtectedRoute>
                  <DoctorForm />
                </ProtectedRoute>
              }
            />
            
            {/* Appointment Routes */}
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/new"
              element={
                <ProtectedRoute>
                  <AppointmentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/:id"
              element={
                <ProtectedRoute>
                  <AppointmentForm />
                </ProtectedRoute>
              }
            />
            
            {/* Medical Records Routes */}
            <Route
              path="/medical-records"
              element={
                <ProtectedRoute>
                  <MedicalRecordsList />
                </ProtectedRoute>
              }
            />
            
            {/* Billing Routes */}
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <BillingList />
                </ProtectedRoute>
              }
            />
            
            {/* Reports Routes */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;