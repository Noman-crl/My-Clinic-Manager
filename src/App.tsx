import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import PharmacyDashboard from './components/Pharmacy/PharmacyDashboard';
import MedicineList from './components/Pharmacy/MedicineList';
import MedicineForm from './components/Pharmacy/MedicineForm';
import PharmacySales from './components/Pharmacy/PharmacySales';
import MedicalShopDashboard from './components/MedicalShop/MedicalShopDashboard';
import POSSystem from './components/MedicalShop/POSSystem';
import PurchaseList from './components/Purchases/PurchaseList';
import PurchaseForm from './components/Purchases/PurchaseForm';
import InventoryList from './components/Inventory/InventoryList';
import AccountsList from './components/Accounts/AccountsList';
import ReportsDashboard from './components/Reports/ReportsDashboard';
import Settings from './components/Settings/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid #3b82f6',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid #3b82f6',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }
  
  if (user) return <Navigate to="/dashboard" replace />;
  return <Home />;
}

const App: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
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
            
            {/* Pharmacy Routes */}
            <Route
              path="/pharmacy"
              element={
                <ProtectedRoute>
                  <PharmacyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/medicines"
              element={
                <ProtectedRoute>
                  <MedicineList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/medicines/new"
              element={
                <ProtectedRoute>
                  <MedicineForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/medicines/:id"
              element={
                <ProtectedRoute>
                  <MedicineForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/sales"
              element={
                <ProtectedRoute>
                  <PharmacySales />
                </ProtectedRoute>
              }
            />
            
            {/* Medical Shop Routes */}
            <Route
              path="/medical-shop"
              element={
                <ProtectedRoute>
                  <MedicalShopDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical-shop/pos"
              element={
                <ProtectedRoute>
                  <POSSystem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical-shop/new-sale"
              element={
                <ProtectedRoute>
                  <POSSystem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical-shop/sales"
              element={
                <ProtectedRoute>
                  <PharmacySales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical-shop/customers"
              element={
                <ProtectedRoute>
                  <PatientList />
                </ProtectedRoute>
              }
            />
            
            {/* Purchase Routes */}
            <Route
              path="/purchases"
              element={
                <ProtectedRoute>
                  <PurchaseList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases/new"
              element={
                <ProtectedRoute>
                  <PurchaseForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases/:id"
              element={
                <ProtectedRoute>
                  <PurchaseForm />
                </ProtectedRoute>
              }
            />
            
            {/* Inventory Routes */}
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <InventoryList />
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
            
            {/* Accounts Routes */}
            <Route
              path="/accounts"
              element={
                <ProtectedRoute>
                  <AccountsList />
                </ProtectedRoute>
              }
            />
            
            {/* Reports Routes */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Settings Routes */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
};

export default App;