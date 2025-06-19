import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Configuration Check:');
console.log('- URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
console.log('- Anon Key:', supabaseAnonKey ? '✅ Present' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ CRITICAL: Missing Supabase environment variables!');
  console.error('Please check your .env file:');
  console.error('VITE_SUPABASE_URL=', supabaseUrl || 'MISSING');
  console.error('VITE_SUPABASE_ANON_KEY=', supabaseAnonKey ? 'Present' : 'MISSING');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Enhanced connection testing
const testConnection = async () => {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
    } else {
      console.log('✅ Session check passed');
      console.log('- User:', sessionData.session?.user?.email || 'Not logged in');
    }

    // Test 2: Database connectivity (without authentication)
    console.log('🔍 Testing database connectivity...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('patients')
      .select('count', { count: 'exact', head: true });
    
    if (healthError) {
      console.error('❌ Database connectivity test failed:', healthError);
      console.error('Error details:', {
        code: healthError.code,
        message: healthError.message,
        details: healthError.details,
        hint: healthError.hint
      });
      
      if (healthError.code === '42P01') {
        console.error('💡 Solution: Tables do not exist. Please run the database migrations.');
      } else if (healthError.code === '42501') {
        console.error('💡 Solution: RLS policy issue. Please run the RLS fix migration.');
      } else {
        console.error('💡 Check your Supabase project settings and ensure the database is accessible.');
      }
    } else {
      console.log('✅ Database connectivity test passed');
      console.log('- Can access patients table');
    }

    // Test 3: Check if tables exist
    console.log('🔍 Checking table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('check_table_exists', { table_name: 'patients' })
      .single();
    
    if (tableError && tableError.code !== '42883') { // Function doesn't exist is OK
      console.error('❌ Table check failed:', tableError);
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
};

// Run connection test
testConnection();

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