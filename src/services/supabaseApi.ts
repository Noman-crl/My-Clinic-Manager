import { supabase } from '../lib/supabase';
import type { Patient, Doctor, Appointment, MedicalRecord, Invoice } from '../lib/supabase';

// Auth functions
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) {
      console.error('Supabase signUp error:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('SignUp function error:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Attempting to sign in with:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Supabase signIn error:', error);
      throw error;
    }
    
    console.log('Sign in successful:', data);
    return data;
  } catch (error) {
    console.error('SignIn function error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase signOut error:', error);
      throw error;
    }
  } catch (error) {
    console.error('SignOut function error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Supabase getCurrentUser error:', error);
      throw error;
    }
    return user;
  } catch (error) {
    console.error('GetCurrentUser function error:', error);
    throw error;
  }
};

// Patient functions
export const getPatients = async () => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('GetPatients function error:', error);
    throw error;
  }
};

export const getPatient = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('GetPatient function error:', error);
    throw error;
  }
};

export const createPatient = async (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .insert([patient])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('CreatePatient function error:', error);
    throw error;
  }
};

export const updatePatient = async (id: string, updates: Partial<Patient>) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('UpdatePatient function error:', error);
    throw error;
  }
};

export const deletePatient = async (id: string) => {
  try {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  } catch (error) {
    console.error('DeletePatient function error:', error);
    throw error;
  }
};

// Doctor functions
export const getDoctors = async () => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('GetDoctors function error:', error);
    throw error;
  }
};

export const getDoctor = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching doctor:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('GetDoctor function error:', error);
    throw error;
  }
};

export const createDoctor = async (doctor: Omit<Doctor, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .insert([doctor])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating doctor:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('CreateDoctor function error:', error);
    throw error;
  }
};

export const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating doctor:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('UpdateDoctor function error:', error);
    throw error;
  }
};

export const deleteDoctor = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) {
      console.error('Error deactivating doctor:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('DeleteDoctor function error:', error);
    throw error;
  }
};

// Appointment functions
export const getAppointments = async () => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients (first_name, last_name, email, phone),
        doctors (first_name, last_name, specialization)
      `)
      .order('appointment_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('GetAppointments function error:', error);
    throw error;
  }
};

export const getAppointment = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients (*),
        doctors (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('GetAppointment function error:', error);
    throw error;
  }
};

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select(`
        *,
        patients (first_name, last_name, email, phone),
        doctors (first_name, last_name, specialization)
      `)
      .single();
    
    if (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('CreateAppointment function error:', error);
    throw error;
  }
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
  try {
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
    
    if (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('UpdateAppointment function error:', error);
    throw error;
  }
};

export const deleteAppointment = async (id: string) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  } catch (error) {
    console.error('DeleteAppointment function error:', error);
    throw error;
  }
};

// Medical Record functions
export const getMedicalRecords = async () => {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        patients (first_name, last_name, email),
        doctors (first_name, last_name, specialization)
      `)
      .order('visit_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching medical records:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('GetMedicalRecords function error:', error);
    throw error;
  }
};

export const createMedicalRecord = async (record: Omit<MedicalRecord, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .insert([record])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating medical record:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('CreateMedicalRecord function error:', error);
    throw error;
  }
};

// Invoice functions
export const getInvoices = async () => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        patients (first_name, last_name, email),
        doctors (first_name, last_name, specialization)
      `)
      .order('issue_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('GetInvoices function error:', error);
    throw error;
  }
};

export const createInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoice])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('CreateInvoice function error:', error);
    throw error;
  }
};

// Dashboard stats
export const getDashboardStats = async () => {
  try {
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
  } catch (error) {
    console.error('GetDashboardStats function error:', error);
    throw error;
  }
};