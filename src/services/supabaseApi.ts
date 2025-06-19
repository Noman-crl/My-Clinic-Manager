import { supabase } from '../lib/supabase';
import type { Patient, Doctor, Appointment, MedicalRecord, Invoice } from '../lib/supabase';

// Auth functions
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    console.log('SignUp API: Attempting to create user:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: undefined // Disable email confirmation for demo
      }
    });
    
    if (error) {
      console.error('Supabase signUp error:', error);
      throw error;
    }
    
    console.log('SignUp API: User created successfully');
    return data;
  } catch (error) {
    console.error('SignUp function error:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('SignIn API: Attempting to sign in:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Supabase signIn error:', error);
      throw error;
    }
    
    console.log('SignIn API: Sign in successful');
    return data;
  } catch (error) {
    console.error('SignIn function error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    console.log('SignOut API: Attempting to sign out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase signOut error:', error);
      throw error;
    }
    console.log('SignOut API: Sign out successful');
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
    console.log('API: Fetching patients...');
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching patients:', error);
      throw new Error(`Failed to fetch patients: ${error.message}`);
    }
    
    console.log('API: Patients fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('GetPatients function error:', error);
    throw error;
  }
};

export const getPatient = async (id: string) => {
  try {
    console.log('API: Fetching patient:', id);
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching patient:', error);
      throw new Error(`Failed to fetch patient: ${error.message}`);
    }
    
    console.log('API: Patient fetched successfully');
    return data;
  } catch (error) {
    console.error('GetPatient function error:', error);
    throw error;
  }
};

export const createPatient = async (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('API: Creating patient:', patient.email);
    
    // Validate required fields
    if (!patient.first_name || !patient.last_name || !patient.email) {
      throw new Error('First name, last name, and email are required');
    }
    
    const { data, error } = await supabase
      .from('patients')
      .insert([patient])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating patient:', error);
      if (error.code === '23505') {
        throw new Error('A patient with this email already exists');
      }
      throw new Error(`Failed to create patient: ${error.message}`);
    }
    
    console.log('API: Patient created successfully');
    return data;
  } catch (error) {
    console.error('CreatePatient function error:', error);
    throw error;
  }
};

export const updatePatient = async (id: string, updates: Partial<Patient>) => {
  try {
    console.log('API: Updating patient:', id);
    
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating patient:', error);
      if (error.code === '23505') {
        throw new Error('A patient with this email already exists');
      }
      throw new Error(`Failed to update patient: ${error.message}`);
    }
    
    console.log('API: Patient updated successfully');
    return data;
  } catch (error) {
    console.error('UpdatePatient function error:', error);
    throw error;
  }
};

export const deletePatient = async (id: string) => {
  try {
    console.log('API: Deleting patient:', id);
    
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting patient:', error);
      throw new Error(`Failed to delete patient: ${error.message}`);
    }
    
    console.log('API: Patient deleted successfully');
  } catch (error) {
    console.error('DeletePatient function error:', error);
    throw error;
  }
};

// Doctor functions
export const getDoctors = async () => {
  try {
    console.log('API: Fetching doctors...');
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching doctors:', error);
      throw new Error(`Failed to fetch doctors: ${error.message}`);
    }
    
    console.log('API: Doctors fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('GetDoctors function error:', error);
    throw error;
  }
};

export const getDoctor = async (id: string) => {
  try {
    console.log('API: Fetching doctor:', id);
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching doctor:', error);
      throw new Error(`Failed to fetch doctor: ${error.message}`);
    }
    
    console.log('API: Doctor fetched successfully');
    return data;
  } catch (error) {
    console.error('GetDoctor function error:', error);
    throw error;
  }
};

export const createDoctor = async (doctor: Omit<Doctor, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('API: Creating doctor:', doctor.email);
    
    // Validate required fields
    if (!doctor.first_name || !doctor.last_name || !doctor.email || !doctor.specialization) {
      throw new Error('First name, last name, email, and specialization are required');
    }
    
    // Ensure is_active is set
    const doctorData = {
      ...doctor,
      is_active: doctor.is_active !== undefined ? doctor.is_active : true
    };
    
    const { data, error } = await supabase
      .from('doctors')
      .insert([doctorData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating doctor:', error);
      if (error.code === '23505') {
        if (error.message.includes('email')) {
          throw new Error('A doctor with this email already exists');
        }
        if (error.message.includes('license_number')) {
          throw new Error('A doctor with this license number already exists');
        }
      }
      throw new Error(`Failed to create doctor: ${error.message}`);
    }
    
    console.log('API: Doctor created successfully');
    return data;
  } catch (error) {
    console.error('CreateDoctor function error:', error);
    throw error;
  }
};

export const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
  try {
    console.log('API: Updating doctor:', id);
    
    const { data, error } = await supabase
      .from('doctors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating doctor:', error);
      if (error.code === '23505') {
        if (error.message.includes('email')) {
          throw new Error('A doctor with this email already exists');
        }
        if (error.message.includes('license_number')) {
          throw new Error('A doctor with this license number already exists');
        }
      }
      throw new Error(`Failed to update doctor: ${error.message}`);
    }
    
    console.log('API: Doctor updated successfully');
    return data;
  } catch (error) {
    console.error('UpdateDoctor function error:', error);
    throw error;
  }
};

export const deleteDoctor = async (id: string) => {
  try {
    console.log('API: Deactivating doctor:', id);
    
    const { data, error } = await supabase
      .from('doctors')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error deactivating doctor:', error);
      throw new Error(`Failed to deactivate doctor: ${error.message}`);
    }
    
    console.log('API: Doctor deactivated successfully');
    return data;
  } catch (error) {
    console.error('DeleteDoctor function error:', error);
    throw error;
  }
};

// Appointment functions
export const getAppointments = async () => {
  try {
    console.log('API: Fetching appointments...');
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
      throw new Error(`Failed to fetch appointments: ${error.message}`);
    }
    
    console.log('API: Appointments fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('GetAppointments function error:', error);
    throw error;
  }
};

export const getAppointment = async (id: string) => {
  try {
    console.log('API: Fetching appointment:', id);
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
      throw new Error(`Failed to fetch appointment: ${error.message}`);
    }
    
    console.log('API: Appointment fetched successfully');
    return data;
  } catch (error) {
    console.error('GetAppointment function error:', error);
    throw error;
  }
};

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('API: Creating appointment for patient:', appointment.patient_id);
    
    // Validate required fields
    if (!appointment.patient_id || !appointment.doctor_id || !appointment.appointment_date || !appointment.appointment_time) {
      throw new Error('Patient, doctor, date, and time are required');
    }
    
    // Ensure duration is set
    const appointmentData = {
      ...appointment,
      duration: appointment.duration || 30
    };
    
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select(`
        *,
        patients (first_name, last_name, email, phone),
        doctors (first_name, last_name, specialization)
      `)
      .single();
    
    if (error) {
      console.error('Error creating appointment:', error);
      throw new Error(`Failed to create appointment: ${error.message}`);
    }
    
    console.log('API: Appointment created successfully');
    return data;
  } catch (error) {
    console.error('CreateAppointment function error:', error);
    throw error;
  }
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
  try {
    console.log('API: Updating appointment:', id);
    
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
      throw new Error(`Failed to update appointment: ${error.message}`);
    }
    
    console.log('API: Appointment updated successfully');
    return data;
  } catch (error) {
    console.error('UpdateAppointment function error:', error);
    throw error;
  }
};

export const deleteAppointment = async (id: string) => {
  try {
    console.log('API: Deleting appointment:', id);
    
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting appointment:', error);
      throw new Error(`Failed to delete appointment: ${error.message}`);
    }
    
    console.log('API: Appointment deleted successfully');
  } catch (error) {
    console.error('DeleteAppointment function error:', error);
    throw error;
  }
};

// Medical Record functions
export const getMedicalRecords = async () => {
  try {
    console.log('API: Fetching medical records...');
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
      throw new Error(`Failed to fetch medical records: ${error.message}`);
    }
    
    console.log('API: Medical records fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('GetMedicalRecords function error:', error);
    throw error;
  }
};

export const createMedicalRecord = async (record: Omit<MedicalRecord, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('API: Creating medical record for patient:', record.patient_id);
    
    const { data, error } = await supabase
      .from('medical_records')
      .insert([record])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating medical record:', error);
      throw new Error(`Failed to create medical record: ${error.message}`);
    }
    
    console.log('API: Medical record created successfully');
    return data;
  } catch (error) {
    console.error('CreateMedicalRecord function error:', error);
    throw error;
  }
};

// Invoice functions
export const getInvoices = async () => {
  try {
    console.log('API: Fetching invoices...');
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
      throw new Error(`Failed to fetch invoices: ${error.message}`);
    }
    
    console.log('API: Invoices fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('GetInvoices function error:', error);
    throw error;
  }
};

export const createInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('API: Creating invoice for patient:', invoice.patient_id);
    
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoice])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating invoice:', error);
      throw new Error(`Failed to create invoice: ${error.message}`);
    }
    
    console.log('API: Invoice created successfully');
    return data;
  } catch (error) {
    console.error('CreateInvoice function error:', error);
    throw error;
  }
};

// Dashboard stats
export const getDashboardStats = async () => {
  try {
    console.log('API: Fetching dashboard stats...');
    
    const [patientsResult, doctorsResult, appointmentsResult, invoicesResult] = await Promise.all([
      supabase.from('patients').select('id', { count: 'exact' }),
      supabase.from('doctors').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('appointments').select('id', { count: 'exact' }).eq('appointment_date', new Date().toISOString().split('T')[0]),
      supabase.from('invoices').select('total_amount').eq('status', 'paid')
    ]);

    // Check for errors in any of the queries
    if (patientsResult.error) {
      console.error('Error fetching patients count:', patientsResult.error);
    }
    if (doctorsResult.error) {
      console.error('Error fetching doctors count:', doctorsResult.error);
    }
    if (appointmentsResult.error) {
      console.error('Error fetching appointments count:', appointmentsResult.error);
    }
    if (invoicesResult.error) {
      console.error('Error fetching invoices:', invoicesResult.error);
    }

    const totalRevenue = invoicesResult.data?.reduce((sum, invoice) => sum + invoice.total_amount, 0) || 0;

    const stats = {
      totalPatients: patientsResult.count || 0,
      totalDoctors: doctorsResult.count || 0,
      todayAppointments: appointmentsResult.count || 0,
      totalRevenue
    };
    
    console.log('API: Dashboard stats fetched successfully:', stats);
    return stats;
  } catch (error) {
    console.error('GetDashboardStats function error:', error);
    throw error;
  }
};