import { supabase } from '../lib/supabase';
import type { Patient, Doctor, Appointment, MedicalRecord, Invoice } from '../lib/supabase';

// Auth functions
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Patient functions
export const getPatients = async () => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getPatient = async (id: string) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createPatient = async (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('patients')
    .insert([patient])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updatePatient = async (id: string, updates: Partial<Patient>) => {
  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deletePatient = async (id: string) => {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Doctor functions
export const getDoctors = async () => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getDoctor = async (id: string) => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createDoctor = async (doctor: Omit<Doctor, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('doctors')
    .insert([doctor])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
  const { data, error } = await supabase
    .from('doctors')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteDoctor = async (id: string) => {
  const { data, error } = await supabase
    .from('doctors')
    .update({ is_active: false })
    .eq('id', id);
  
  if (error) throw error;
};

// Appointment functions
export const getAppointments = async () => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patients (first_name, last_name, email, phone),
      doctors (first_name, last_name, specialization)
    `)
    .order('appointment_date', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getAppointment = async (id: string) => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patients (*),
      doctors (*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointment])
    .select(`
      *,
      patients (first_name, last_name, email, phone),
      doctors (first_name, last_name, specialization)
    `)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      patients (first_name, last_name, email, phone),
      doctors (first_name, last_name, specialization)
    `)
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteAppointment = async (id: string) => {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Medical Record functions
export const getMedicalRecords = async () => {
  const { data, error } = await supabase
    .from('medical_records')
    .select(`
      *,
      patients (first_name, last_name, email),
      doctors (first_name, last_name, specialization)
    `)
    .order('visit_date', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createMedicalRecord = async (record: Omit<MedicalRecord, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('medical_records')
    .insert([record])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Invoice functions
export const getInvoices = async () => {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      patients (first_name, last_name, email),
      doctors (first_name, last_name, specialization)
    `)
    .order('issue_date', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('invoices')
    .insert([invoice])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Dashboard stats
export const getDashboardStats = async () => {
  const [patientsResult, doctorsResult, appointmentsResult, invoicesResult] = await Promise.all([
    supabase.from('patients').select('id', { count: 'exact' }),
    supabase.from('doctors').select('id', { count: 'exact' }).eq('is_active', true),
    supabase.from('appointments').select('id', { count: 'exact' }).eq('appointment_date', new Date().toISOString().split('T')[0]),
    supabase.from('invoices').select('total_amount').eq('status', 'paid')
  ]);

  const totalRevenue = invoicesResult.data?.reduce((sum, invoice) => sum + invoice.total_amount, 0) || 0;

  return {
    totalPatients: patientsResult.count || 0,
    totalDoctors: doctorsResult.count || 0,
    todayAppointments: appointmentsResult.count || 0,
    totalRevenue
  };
};