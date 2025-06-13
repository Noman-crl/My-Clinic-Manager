import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
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
import { useClinicStore } from './store';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/signin" replace />;
  return children;
};

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<string | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<string | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null);

  const {
    patients,
    doctors,
    appointments,
    addPatient,
    updatePatient,
    deletePatient,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  } = useClinicStore();

  const handleAddPatient = () => {
    setEditingPatient(null);
    setShowPatientForm(true);
  };

  const handleEditPatient = (patientId: string) => {
    setEditingPatient(patientId);
    setShowPatientForm(true);
  };

  const handleSavePatient = (patientData: any) => {
    if (editingPatient) {
      updatePatient(editingPatient, patientData);
    } else {
      addPatient({
        ...patientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
    }
    setShowPatientForm(false);
    setEditingPatient(null);
  };

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setShowDoctorForm(true);
  };

  const handleEditDoctor = (doctorId: string) => {
    setEditingDoctor(doctorId);
    setShowDoctorForm(true);
  };

  const handleSaveDoctor = (doctorData: any) => {
    if (editingDoctor) {
      updateDoctor(editingDoctor, doctorData);
    } else {
      addDoctor({
        ...doctorData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
    }
    setShowDoctorForm(false);
    setEditingDoctor(null);
  };

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setShowAppointmentForm(true);
  };

  const handleEditAppointment = (appointmentId: string) => {
    setEditingAppointment(appointmentId);
    setShowAppointmentForm(true);
  };

  const handleSaveAppointment = (appointmentData: any) => {
    if (editingAppointment) {
      updateAppointment(editingAppointment, appointmentData);
    } else {
      addAppointment({
        ...appointmentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
    }
    setShowAppointmentForm(false);
    setEditingAppointment(null);
  };

  const renderContent = () => {
    if (showPatientForm) {
      const patient = editingPatient
        ? patients.find((p) => p.id === editingPatient)
        : undefined;
      return (
        <PatientForm
          patient={patient}
          onSave={handleSavePatient}
          onCancel={() => {
            setShowPatientForm(false);
            setEditingPatient(null);
          }}
        />
      );
    }

    if (showDoctorForm) {
      const doctor = editingDoctor
        ? doctors.find((d) => d.id === editingDoctor)
        : undefined;
      return (
        <DoctorForm
          doctor={doctor}
          onSave={handleSaveDoctor}
          onCancel={() => {
            setShowDoctorForm(false);
            setEditingDoctor(null);
          }}
        />
      );
    }

    if (showAppointmentForm) {
      const appointment = editingAppointment
        ? appointments.find((a) => a.id === editingAppointment)
        : undefined;
      return (
        <AppointmentForm
          appointment={appointment}
          onSave={handleSaveAppointment}
          onCancel={() => {
            setShowAppointmentForm(false);
            setEditingAppointment(null);
          }}
        />
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return (
          <PatientList
            onAddPatient={handleAddPatient}
            onEditPatient={handleEditPatient}
          />
        );
      case 'doctors':
        return (
          <DoctorList
            onAddDoctor={handleAddDoctor}
            onEditDoctor={handleEditDoctor}
          />
        );
      case 'appointments':
        return (
          <AppointmentList
            onAddAppointment={handleAddAppointment}
            onEditAppointment={handleEditAppointment}
          />
        );
      case 'medical-records':
        return <MedicalRecordsList />;
      case 'billing':
        return <BillingList />;
      case 'reports':
        return <Reports />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
                  <div className="flex-1 flex flex-col ml-64">
                    <Header />
                    <main className="flex-1 overflow-y-auto pt-16 p-6">
                      {renderContent()}
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;