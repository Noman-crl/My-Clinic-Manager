import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Don't redirect if we're already on signin page
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');

// Patients
export const getPatients = (params?: any) => api.get('/patients', { params });
export const getPatient = (id: string) => api.get(`/patients/${id}`);
export const createPatient = (data: any) => api.post('/patients', data);
export const updatePatient = (id: string, data: any) => api.put(`/patients/${id}`, data);
export const deletePatient = (id: string) => api.delete(`/patients/${id}`);
export const getPatientStats = () => api.get('/patients/stats/overview');

// Doctors
export const getDoctors = (params?: any) => api.get('/doctors', { params });
export const getDoctor = (id: string) => api.get(`/doctors/${id}`);
export const createDoctor = (data: any) => api.post('/doctors', data);
export const updateDoctor = (id: string, data: any) => api.put(`/doctors/${id}`, data);
export const deleteDoctor = (id: string) => api.delete(`/doctors/${id}`);
export const getDoctorAvailability = (id: string, date: string) => 
  api.get(`/doctors/${id}/availability`, { params: { date } });
export const getDoctorStats = () => api.get('/doctors/stats/overview');

// Appointments
export const getAppointments = (params?: any) => api.get('/appointments', { params });
export const getAppointment = (id: string) => api.get(`/appointments/${id}`);
export const createAppointment = (data: any) => api.post('/appointments', data);
export const updateAppointment = (id: string, data: any) => api.put(`/appointments/${id}`, data);
export const cancelAppointment = (id: string, data: any) => api.patch(`/appointments/${id}/cancel`, data);
export const rescheduleAppointment = (id: string, data: any) => api.patch(`/appointments/${id}/reschedule`, data);
export const getTodayAppointments = () => api.get('/appointments/today/list');
export const getAppointmentStats = () => api.get('/appointments/stats/overview');

// Medical Records
export const getMedicalRecords = (params?: any) => api.get('/medical-records', { params });
export const getMedicalRecord = (id: string) => api.get(`/medical-records/${id}`);
export const createMedicalRecord = (data: any) => api.post('/medical-records', data);
export const updateMedicalRecord = (id: string, data: any) => api.put(`/medical-records/${id}`, data);
export const deleteMedicalRecord = (id: string) => api.delete(`/medical-records/${id}`);
export const getPatientMedicalHistory = (patientId: string) => 
  api.get(`/medical-records/patient/${patientId}/history`);
export const searchMedicalRecords = (params: any) => api.get('/medical-records/search/query', { params });

// Invoices
export const getInvoices = (params?: any) => api.get('/invoices', { params });
export const getInvoice = (id: string) => api.get(`/invoices/${id}`);
export const createInvoice = (data: any) => api.post('/invoices', data);
export const updateInvoice = (id: string, data: any) => api.put(`/invoices/${id}`, data);
export const markInvoicePaid = (id: string, data: any) => api.patch(`/invoices/${id}/pay`, data);
export const sendInvoice = (id: string) => api.patch(`/invoices/${id}/send`);
export const getInvoiceStats = () => api.get('/invoices/stats/overview');

export default api;