import { supabase } from '../lib/supabase';
import type { Patient, Doctor, Appointment, MedicalRecord, Invoice } from '../lib/supabase';

// Auth functions
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    console.log('📝 SignUp API: Attempting to create user:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: undefined // Disable email confirmation for demo
      }
    });
    
    if (error) {
      console.error('❌ Supabase signUp error:', error);
      throw error;
    }
    
    console.log('✅ SignUp API: User created successfully');
    
    // For demo purposes, if email confirmation is disabled, the user should be immediately available
    if (data.user && !data.user.email_confirmed_at) {
      console.log('📧 User created - email confirmation may be required');
    }
    
    return data;
  } catch (error) {
    console.error('❌ SignUp function error:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('🔐 SignIn API: Attempting to sign in:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('❌ Supabase signIn error:', error);
      throw error;
    }
    
    console.log('✅ SignIn API: Sign in successful');
    console.log('🔐 User authenticated:', data.user?.email);
    
    return data;
  } catch (error) {
    console.error('❌ SignIn function error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    console.log('🚪 SignOut API: Attempting to sign out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Supabase signOut error:', error);
      throw error;
    }
    console.log('✅ SignOut API: Sign out successful');
  } catch (error) {
    console.error('❌ SignOut function error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('❌ Supabase getCurrentUser error:', error);
      throw error;
    }
    return user;
  } catch (error) {
    console.error('❌ GetCurrentUser function error:', error);
    throw error;
  }
};

// User management functions
export const createUser = async (userData: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  permissions: string[];
  is_active: boolean;
}) => {
  try {
    console.log('👤 API: Creating user account:', userData.email);
    
    // Check authentication first
    await checkAuth();
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role
      }
    });
    
    if (authError) {
      console.error('❌ Error creating auth user:', authError);
      throw new Error(`Failed to create user account: ${authError.message}`);
    }
    
    // Create user profile in users table
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([{
        auth_user_id: authData.user.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        permissions: userData.permissions,
        is_active: userData.is_active
      }])
      .select()
      .single();
    
    if (profileError) {
      console.error('❌ Error creating user profile:', profileError);
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Failed to create user profile: ${profileError.message}`);
    }
    
    console.log('✅ API: User created successfully');
    return { authUser: authData.user, profile: profileData };
  } catch (error) {
    console.error('❌ CreateUser function error:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, updates: {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  permissions?: string[];
  is_active?: boolean;
}) => {
  try {
    console.log('👤 API: Updating user:', userId);
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error updating user:', error);
      throw new Error(`Failed to update user: ${error.message}`);
    }
    
    console.log('✅ API: User updated successfully');
    return data;
  } catch (error) {
    console.error('❌ UpdateUser function error:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    console.log('👤 API: Deleting user:', userId);
    
    // Check authentication first
    await checkAuth();
    
    // Get auth_user_id from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('auth_user_id')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('❌ Error fetching user:', userError);
      throw new Error(`Failed to fetch user: ${userError.message}`);
    }
    
    // Delete user from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userData.auth_user_id);
    
    if (authError) {
      console.error('❌ Error deleting auth user:', authError);
      throw new Error(`Failed to delete user account: ${authError.message}`);
    }
    
    // Delete user profile (should cascade due to foreign key)
    const { error: profileError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (profileError) {
      console.error('❌ Error deleting user profile:', profileError);
      throw new Error(`Failed to delete user profile: ${profileError.message}`);
    }
    
    console.log('✅ API: User deleted successfully');
  } catch (error) {
    console.error('❌ DeleteUser function error:', error);
    throw error;
  }
};

// Pharmacy Sales functions
export const createPharmacySale = async (saleData: {
  patient_id?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_age?: number;
  items: Array<{
    medicine_id: string;
    medicine_name: string;
    quantity: number;
    unit_price: number;
    discount_percent: number;
    gst_rate: number;
  }>;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  net_amount: number;
  payment_method: string;
  notes?: string;
}) => {
  try {
    console.log('💊 API: Creating pharmacy sale...');
    
    // Check authentication first
    const user = await checkAuth();
    
    // Create the sale record
    const { data: saleRecord, error: saleError } = await supabase
      .from('pharmacy_sales')
      .insert([{
        patient_id: saleData.patient_id,
        total_amount: saleData.total_amount,
        discount_amount: saleData.discount_amount,
        tax_amount: saleData.tax_amount,
        net_amount: saleData.net_amount,
        payment_method: saleData.payment_method,
        payment_status: 'paid',
        served_by: user.id,
        notes: saleData.notes || `Customer: ${saleData.customer_name || 'Walk-in'}, Phone: ${saleData.customer_phone || 'N/A'}, Age: ${saleData.customer_age || 'N/A'}`
      }])
      .select()
      .single();
    
    if (saleError) {
      console.error('❌ Error creating pharmacy sale:', saleError);
      throw new Error(`Failed to create sale: ${saleError.message}`);
    }
    
    // Create sale items
    const saleItems = saleData.items.map(item => {
      const itemTotal = item.quantity * item.unit_price;
      const discountAmount = (itemTotal * item.discount_percent) / 100;
      const taxableAmount = itemTotal - discountAmount;
      const taxAmount = (taxableAmount * item.gst_rate) / 100;
      const totalAmount = taxableAmount + taxAmount;
      
      return {
        sale_id: saleRecord.id,
        medicine_id: item.medicine_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_percent: item.discount_percent,
        discount_amount: discountAmount,
        tax_percent: item.gst_rate,
        tax_amount: taxAmount,
        total_amount: totalAmount
      };
    });
    
    const { error: itemsError } = await supabase
      .from('pharmacy_sale_items')
      .insert(saleItems);
    
    if (itemsError) {
      console.error('❌ Error creating sale items:', itemsError);
      // Clean up the sale record if items creation fails
      await supabase.from('pharmacy_sales').delete().eq('id', saleRecord.id);
      throw new Error(`Failed to create sale items: ${itemsError.message}`);
    }
    
    console.log('✅ API: Pharmacy sale created successfully');
    return saleRecord;
  } catch (error) {
    console.error('❌ CreatePharmacySale function error:', error);
    throw error;
  }
};

export const getPharmacySales = async () => {
  try {
    console.log('💊 API: Fetching pharmacy sales...');
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('pharmacy_sales')
      .select(`
        *,
        patients (first_name, last_name, email, phone),
        pharmacy_sale_items (
          *,
          medicines (name, generic_name)
        )
      `)
      .order('sale_date', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching pharmacy sales:', error);
      throw new Error(`Failed to fetch sales: ${error.message}`);
    }
    
    console.log('✅ API: Pharmacy sales fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ GetPharmacySales function error:', error);
    throw error;
  }
};

export const getPharmacySale = async (saleId: string) => {
  try {
    console.log('💊 API: Fetching pharmacy sale:', saleId);
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('pharmacy_sales')
      .select(`
        *,
        patients (first_name, last_name, email, phone),
        pharmacy_sale_items (
          *,
          medicines (name, generic_name, unit)
        )
      `)
      .eq('id', saleId)
      .single();
    
    if (error) {
      console.error('❌ Error fetching pharmacy sale:', error);
      throw new Error(`Failed to fetch sale: ${error.message}`);
    }
    
    console.log('✅ API: Pharmacy sale fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ GetPharmacySale function error:', error);
    throw error;
  }
};

// Helper function to check authentication with better error handling
const checkAuth = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Auth check failed:', error);
      throw new Error('Authentication required. Please sign in again.');
    }
    
    if (!user) {
      console.error('❌ No authenticated user found');
      throw new Error('You must be signed in to perform this action.');
    }
    
    console.log('✅ User authenticated:', user.email);
    return user;
  } catch (error) {
    console.error('❌ checkAuth error:', error);
    throw error;
  }
};

// Patient functions
export const getPatients = async () => {
  try {
    console.log('📋 API: Fetching patients...');
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching patients:', error);
      throw new Error(`Failed to fetch patients: ${error.message}`);
    }
    
    console.log('✅ API: Patients fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ GetPatients function error:', error);
    throw error;
  }
};

export const getPatient = async (id: string) => {
  try {
    console.log('📋 API: Fetching patient:', id);
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('❌ Error fetching patient:', error);
      throw new Error(`Failed to fetch patient: ${error.message}`);
    }
    
    console.log('✅ API: Patient fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ GetPatient function error:', error);
    throw error;
  }
};

export const createPatient = async (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('📋 API: Creating patient:', patient.email);
    
    // Check authentication first
    const user = await checkAuth();
    console.log('🔐 Authenticated user for patient creation:', user.email);
    
    // Validate required fields
    if (!patient.first_name || !patient.last_name || !patient.email) {
      throw new Error('First name, last name, and email are required');
    }
    
    console.log('📝 Patient data to insert:', {
      ...patient,
      email: patient.email,
      first_name: patient.first_name,
      last_name: patient.last_name
    });
    
    const { data, error } = await supabase
      .from('patients')
      .insert([patient])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating patient:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      if (error.code === '23505') {
        throw new Error('A patient with this email already exists');
      }
      if (error.code === '42501') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error(`Failed to create patient: ${error.message}`);
    }
    
    console.log('✅ API: Patient created successfully');
    return data;
  } catch (error) {
    console.error('❌ CreatePatient function error:', error);
    throw error;
  }
};

export const updatePatient = async (id: string, updates: Partial<Patient>) => {
  try {
    console.log('📋 API: Updating patient:', id);
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error updating patient:', error);
      if (error.code === '23505') {
        throw new Error('A patient with this email already exists');
      }
      if (error.code === '42501') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error(`Failed to update patient: ${error.message}`);
    }
    
    console.log('✅ API: Patient updated successfully');
    return data;
  } catch (error) {
    console.error('❌ UpdatePatient function error:', error);
    throw error;
  }
};

export const deletePatient = async (id: string) => {
  try {
    console.log('📋 API: Deleting patient:', id);
    
    // Check authentication first
    await checkAuth();
    
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ Error deleting patient:', error);
      if (error.code === '42501') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error(`Failed to delete patient: ${error.message}`);
    }
    
    console.log('✅ API: Patient deleted successfully');
  } catch (error) {
    console.error('❌ DeletePatient function error:', error);
    throw error;
  }
};

// Doctor functions
export const getDoctors = async () => {
  try {
    console.log('👨‍⚕️ API: Fetching doctors...');
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching doctors:', error);
      throw new Error(`Failed to fetch doctors: ${error.message}`);
    }
    
    console.log('✅ API: Doctors fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ GetDoctors function error:', error);
    throw error;
  }
};

export const getDoctor = async (id: string) => {
  try {
    console.log('👨‍⚕️ API: Fetching doctor:', id);
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('❌ Error fetching doctor:', error);
      throw new Error(`Failed to fetch doctor: ${error.message}`);
    }
    
    console.log('✅ API: Doctor fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ GetDoctor function error:', error);
    throw error;
  }
};

export const createDoctor = async (doctor: Omit<Doctor, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('👨‍⚕️ API: Creating doctor:', doctor.email);
    
    // Check authentication first
    const user = await checkAuth();
    console.log('🔐 Authenticated user for doctor creation:', user.email);
    
    // Validate required fields
    if (!doctor.first_name || !doctor.last_name || !doctor.email || !doctor.specialization) {
      throw new Error('First name, last name, email, and specialization are required');
    }
    
    // Ensure is_active is set
    const doctorData = {
      ...doctor,
      is_active: doctor.is_active !== undefined ? doctor.is_active : true
    };
    
    console.log('📝 Doctor data to insert:', {
      ...doctorData,
      email: doctorData.email,
      first_name: doctorData.first_name,
      last_name: doctorData.last_name,
      specialization: doctorData.specialization
    });
    
    const { data, error } = await supabase
      .from('doctors')
      .insert([doctorData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating doctor:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      if (error.code === '23505') {
        if (error.message.includes('email')) {
          throw new Error('A doctor with this email already exists');
        }
        if (error.message.includes('license_number')) {
          throw new Error('A doctor with this license number already exists');
        }
      }
      if (error.code === '42501') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error(`Failed to create doctor: ${error.message}`);
    }
    
    console.log('✅ API: Doctor created successfully');
    return data;
  } catch (error) {
    console.error('❌ CreateDoctor function error:', error);
    throw error;
  }
};

export const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
  try {
    console.log('👨‍⚕️ API: Updating doctor:', id);
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('doctors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error updating doctor:', error);
      if (error.code === '23505') {
        if (error.message.includes('email')) {
          throw new Error('A doctor with this email already exists');
        }
        if (error.message.includes('license_number')) {
          throw new Error('A doctor with this license number already exists');
        }
      }
      if (error.code === '42501') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error(`Failed to update doctor: ${error.message}`);
    }
    
    console.log('✅ API: Doctor updated successfully');
    return data;
  } catch (error) {
    console.error('❌ UpdateDoctor function error:', error);
    throw error;
  }
};

export const deleteDoctor = async (id: string) => {
  try {
    console.log('👨‍⚕️ API: Deactivating doctor:', id);
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('doctors')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error deactivating doctor:', error);
      if (error.code === '42501') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error(`Failed to deactivate doctor: ${error.message}`);
    }
    
    console.log('✅ API: Doctor deactivated successfully');
    return data;
  } catch (error) {
    console.error('❌ DeleteDoctor function error:', error);
    throw error;
  }
};

// Appointment functions
export const getAppointments = async () => {
  try {
    console.log('📅 API: Fetching appointments...');
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients (first_name, last_name, email, phone),
        doctors (first_name, last_name, specialization)
      `)
      .order('appointment_date', { ascending: true });
    
    if (error) {
      console.error('❌ Error fetching appointments:', error);
      throw new Error(`Failed to fetch appointments: ${error.message}`);
    }
    
    console.log('✅ API: Appointments fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ GetAppointments function error:', error);
    throw error;
  }
};

export const getAppointment = async (id: string) => {
  try {
    console.log('📅 API: Fetching appointment:', id);
    
    // Check authentication first
    await checkAuth();
    
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
      console.error('❌ Error fetching appointment:', error);
      throw new Error(`Failed to fetch appointment: ${error.message}`);
    }
    
    console.log('✅ API: Appointment fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ GetAppointment function error:', error);
    throw error;
  }
};

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('📅 API: Creating appointment for patient:', appointment.patient_id);
    
    // Check authentication first
    await checkAuth();
    
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
      console.error('❌ Error creating appointment:', error);
      if (error.code === '42501') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error(`Failed to create appointment: ${error.message}`);
    }
    
    console.log('✅ API: Appointment created successfully');
    return data;
  } catch (error) {
    console.error('❌ CreateAppointment function error:', error);
    throw error;
  }
};

export const createPhoneAppointment = async (phoneAppointment: {
  patient_name: string;
  phone: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  notes?: string;
}) => {
  try {
    console.log('📅 API: Creating phone appointment for:', phoneAppointment.patient_name);
    
    // Check authentication first
    await checkAuth();
    
    // Validate required fields
    if (!phoneAppointment.patient_name || !phoneAppointment.phone || !phoneAppointment.doctor_id || 
        !phoneAppointment.appointment_date || !phoneAppointment.appointment_time) {
      throw new Error('Patient name, phone, doctor, date, and time are required');
    }
    
    // Check if patient already exists by phone number
    const { data: existingPatients, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .ilike('phone', `%${phoneAppointment.phone.slice(-10)}%`)
      .limit(1);
    
    if (patientError) {
      console.error('❌ Error checking existing patient:', patientError);
    }
    
    // Create appointment with or without patient_id
    const appointmentData = {
      doctor_id: phoneAppointment.doctor_id,
      appointment_date: phoneAppointment.appointment_date,
      appointment_time: phoneAppointment.appointment_time,
      reason: phoneAppointment.reason,
      status: 'scheduled' as const,
      duration: 30,
      notes: `Phone booking for ${phoneAppointment.patient_name} (${phoneAppointment.phone})${phoneAppointment.notes ? ` - ${phoneAppointment.notes}` : ''}`,
      patient_id: existingPatients && existingPatients.length > 0 ? existingPatients[0].id : null
    };
    
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating phone appointment:', error);
      if (error.code === '42501') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error(`Failed to create phone appointment: ${error.message}`);
    }
    
    console.log('✅ API: Phone appointment created successfully');
    return data;
  } catch (error) {
    console.error('❌ CreatePhoneAppointment function error:', error);
    throw error;
  }
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
  try {
    console.log('📅 API: Updating appointment:', id);
    
    // Check authentication first
    await checkAuth();
    
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
      console.error('❌ Error updating appointment:', error);
      if (error.code === '42501') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error(`Failed to update appointment: ${error.message}`);
    }
    
    console.log('✅ API: Appointment updated successfully');
    return data;
  } catch (error) {
    console.error('❌ UpdateAppointment function error:', error);
    throw error;
  }
};

export const deleteAppointment = async (id: string) => {
  try {
    console.log('📅 API: Deleting appointment:', id);
    
    // Check authentication first
    await checkAuth();
    
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ Error deleting appointment:', error);
      if (error.code === '42501') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error(`Failed to delete appointment: ${error.message}`);
    }
    
    console.log('✅ API: Appointment deleted successfully');
  } catch (error) {
    console.error('❌ DeleteAppointment function error:', error);
    throw error;
  }
};

// Medical Record functions
export const getMedicalRecords = async () => {
  try {
    console.log('📋 API: Fetching medical records...');
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        patients (first_name, last_name, email),
        doctors (first_name, last_name, specialization)
      `)
      .order('visit_date', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching medical records:', error);
      throw new Error(`Failed to fetch medical records: ${error.message}`);
    }
    
    console.log('✅ API: Medical records fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ GetMedicalRecords function error:', error);
    throw error;
  }
};

export const createMedicalRecord = async (record: Omit<MedicalRecord, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('📋 API: Creating medical record for patient:', record.patient_id);
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('medical_records')
      .insert([record])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating medical record:', error);
      if (error.code === '42501') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error(`Failed to create medical record: ${error.message}`);
    }
    
    console.log('✅ API: Medical record created successfully');
    return data;
  } catch (error) {
    console.error('❌ CreateMedicalRecord function error:', error);
    throw error;
  }
};

// Invoice functions
export const getInvoices = async () => {
  try {
    console.log('💰 API: Fetching invoices...');
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        patients (first_name, last_name, email),
        doctors (first_name, last_name, specialization)
      `)
      .order('issue_date', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching invoices:', error);
      throw new Error(`Failed to fetch invoices: ${error.message}`);
    }
    
    console.log('✅ API: Invoices fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ GetInvoices function error:', error);
    throw error;
  }
};

export const createInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('💰 API: Creating invoice for patient:', invoice.patient_id);
    
    // Check authentication first
    await checkAuth();
    
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoice])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating invoice:', error);
      if (error.code === '42501') {
        throw new Error('Permission denied. Please check your authentication.');
      }
      throw new Error(`Failed to create invoice: ${error.message}`);
    }
    
    console.log('✅ API: Invoice created successfully');
    return data;
  } catch (error) {
    console.error('❌ CreateInvoice function error:', error);
    throw error;
  }
};

// Dashboard stats
export const getDashboardStats = async () => {
  try {
    console.log('📊 API: Fetching dashboard stats...');
    
    // Check authentication first
    await checkAuth();
    
    const [patientsResult, doctorsResult, appointmentsResult, invoicesResult] = await Promise.all([
      supabase.from('patients').select('id', { count: 'exact' }),
      supabase.from('doctors').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('appointments').select('id', { count: 'exact' }).eq('appointment_date', new Date().toISOString().split('T')[0]),
      supabase.from('invoices').select('total_amount').eq('status', 'paid')
    ]);

    // Check for errors in any of the queries
    if (patientsResult.error) {
      console.error('❌ Error fetching patients count:', patientsResult.error);
      throw new Error(`Failed to fetch patients count: ${patientsResult.error.message}`);
    }
    if (doctorsResult.error) {
      console.error('❌ Error fetching doctors count:', doctorsResult.error);
      throw new Error(`Failed to fetch doctors count: ${doctorsResult.error.message}`);
    }
    if (appointmentsResult.error) {
      console.error('❌ Error fetching appointments count:', appointmentsResult.error);
      throw new Error(`Failed to fetch appointments count: ${appointmentsResult.error.message}`);
    }
    if (invoicesResult.error) {
      console.error('❌ Error fetching invoices:', invoicesResult.error);
      throw new Error(`Failed to fetch invoices: ${invoicesResult.error.message}`);
    }

    const totalRevenue = invoicesResult.data?.reduce((sum, invoice) => sum + invoice.total_amount, 0) || 0;

    const stats = {
      totalPatients: patientsResult.count || 0,
      totalDoctors: doctorsResult.count || 0,
      todayAppointments: appointmentsResult.count || 0,
      totalRevenue
    };
    
    console.log('✅ API: Dashboard stats fetched successfully:', stats);
    return stats;
  } catch (error) {
    console.error('❌ GetDashboardStats function error:', error);
    throw error;
  }
};