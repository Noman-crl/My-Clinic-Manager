import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

export async function register(name: string, email: string, password: string) {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
}

export async function getCurrentUser(token: string) {
  const res = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
} 