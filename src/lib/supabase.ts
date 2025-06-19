import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Configuration:');
console.log('- URL:', supabaseUrl ? 'Present' : 'Missing');
console.log('- Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test the connection and log detailed information
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection error:', error);
  } else {
    console.log('✅ Supabase connected successfully');
    console.log('- Session:', data.session ? 'Active' : 'None');
    console.log('- User:', data.session?.user?.email || 'Not logged in');
  }
});

// Test database connectivity
supabase.from('patients').select('count', { count: 'exact', head: true }).then(({ error, count }) => {
  if (error) {
    console.error('❌ Database connection error:', error);
    console.error('This might indicate:');
    console.error('1. RLS policies are not set up correctly');
    console.error('2. Tables do not exist');
    console.error('3. Invalid credentials');
  } else {
    console.log('✅ Database connected successfully');
    console.log('- Patients table accessible');
    console.log('- Current patient count:', count || 0);
  }
});

// Database types
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergency_contact: string;
  emergency_phone: string;
  insurance_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialization: string;
  license_number: string;
  experience: number;
  consultation_fee: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  reason: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  patients?: Patient;
  doctors?: Doctor;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  visit_date: string;
  chief_complaint: string;
  diagnosis: string;
  treatment: string;
  medications: any[];
  notes: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  items: any[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'partially-paid' | 'overdue' | 'cancelled';
  created_at: string;
  updated_at: string;
}