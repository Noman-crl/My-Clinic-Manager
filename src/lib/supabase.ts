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

// New types for comprehensive system
export interface User {
  id: string;
  auth_user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'doctor' | 'pharmacist' | 'accountant' | 'receptionist';
  permissions: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Medicine {
  id: string;
  name: string;
  generic_name?: string;
  manufacturer?: string;
  category?: string;
  unit: string;
  strength?: string;
  form?: string;
  batch_number?: string;
  expiry_date?: string;
  purchase_price: number;
  selling_price: number;
  mrp: number;
  stock_quantity: number;
  minimum_stock: number;
  maximum_stock: number;
  location?: string;
  hsn_code?: string;
  gst_rate: number;
  is_prescription_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  gstin?: string;
  pan?: string;
  payment_terms: number;
  credit_limit: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  purchase_number: string;
  supplier_id: string;
  purchase_date: string;
  invoice_number?: string;
  invoice_date?: string;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  net_amount: number;
  payment_status: 'pending' | 'partial' | 'paid';
  status: 'draft' | 'ordered' | 'received' | 'cancelled';
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Relations
  suppliers?: Supplier;
  purchase_items?: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  medicine_id: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  total_amount: number;
  batch_number?: string;
  expiry_date?: string;
  created_at: string;
  // Relations
  medicines?: Medicine;
}

export interface PharmacySale {
  id: string;
  sale_number: string;
  patient_id?: string;
  doctor_id?: string;
  prescription_id?: string;
  sale_date: string;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  net_amount: number;
  payment_method: 'cash' | 'card' | 'upi' | 'credit';
  payment_status: 'pending' | 'paid' | 'refunded';
  served_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  patients?: Patient;
  doctors?: Doctor;
  pharmacy_sale_items?: PharmacySaleItem[];
}

export interface PharmacySaleItem {
  id: string;
  sale_id: string;
  medicine_id: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  total_amount: number;
  batch_number?: string;
  expiry_date?: string;
  created_at: string;
  // Relations
  medicines?: Medicine;
}

export interface Account {
  id: string;
  account_code: string;
  account_name: string;
  account_type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  parent_account_id?: string;
  is_active: boolean;
  opening_balance: number;
  current_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  transaction_number: string;
  transaction_date: string;
  reference_type?: string;
  reference_id?: string;
  description: string;
  total_amount: number;
  created_by?: string;
  approved_by?: string;
  status: 'draft' | 'posted' | 'cancelled';
  created_at: string;
  updated_at: string;
  // Relations
  transaction_entries?: TransactionEntry[];
}

export interface TransactionEntry {
  id: string;
  transaction_id: string;
  account_id: string;
  debit_amount: number;
  credit_amount: number;
  description?: string;
  created_at: string;
  // Relations
  accounts?: Account;
}

export interface TaxSetting {
  id: string;
  tax_name: string;
  tax_type: 'gst' | 'tds' | 'cess' | 'other';
  tax_rate: number;
  is_active: boolean;
  applicable_from: string;
  applicable_to?: string;
  created_at: string;
  updated_at: string;
}