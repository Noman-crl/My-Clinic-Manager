import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

// Patients
export const getPatients = () => api.get('/patients');
export const getPatient = (id: string) => api.get(`/patients/${id}`);
export const createPatient = (data: any) => api.post('/patients', data);
export const updatePatient = (id: string, data: any) => api.put(`/patients/${id}`, data);
export const deletePatient = (id: string) => api.delete(`/patients/${id}`);

// Doctors
export const getDoctors = () => api.get('/doctors');
export const getDoctor = (id: string) => api.get(`/doctors/${id}`);
export const createDoctor = (data: any) => api.post('/doctors', data);
export const updateDoctor = (id: string, data: any) => api.put(`/doctors/${id}`, data);
export const deleteDoctor = (id: string) => api.delete(`/doctors/${id}`);

// Appointments
export const getAppointments = () => api.get('/appointments');
export const getAppointment = (id: string) => api.get(`/appointments/${id}`);
export const createAppointment = (data: any) => api.post('/appointments', data);
export const updateAppointment = (id: string, data: any) => api.put(`/appointments/${id}`, data);
export const deleteAppointment = (id: string) => api.delete(`/appointments/${id}`);

export default api; 