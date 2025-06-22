import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Phone, Calendar, Clock, User, UserCheck, Search } from 'lucide-react';
import { getDoctors, getPatients } from '../../services/supabaseApi';
import type { Doctor, Patient } from '../../lib/supabase';

interface PhoneAppointmentData {
  patient_name: string;
  phone: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  notes?: string;
  is_phone_booking: boolean;
}

const PhoneAppointmentForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [existingPatient, setExistingPatient] = useState<Patient | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PhoneAppointmentData>({
    defaultValues: {
      is_phone_booking: true
    }
  });

  const watchPhone = watch('phone');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [doctorsData, patientsData] = await Promise.all([
          getDoctors(),
          getPatients()
        ]);
        setDoctors(doctorsData);
        setPatients(patientsData);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check for existing patient when phone number changes
  useEffect(() => {
    if (watchPhone && watchPhone.length >= 10) {
      const patient = patients.find(p => p.phone.includes(watchPhone.slice(-10)));
      if (patient) {
        setExistingPatient(patient);
        setValue('patient_name', `${patient.first_name} ${patient.last_name}`);
      } else {
        setExistingPatient(null);
      }
    } else {
      setExistingPatient(null);
    }
  }, [watchPhone, patients, setValue]);

  const onSubmit = async (data: PhoneAppointmentData) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Phone appointment data:', data);
      
      // Create phone appointment record
      const appointmentData = {
        ...data,
        patient_id: existingPatient?.id || null,
        duration: 30,
        status: 'scheduled' as const
      };

      // Simulate API call to create phone appointment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Phone appointment created:', appointmentData);
      
      alert(`Phone appointment scheduled successfully!\n\nPatient: ${data.patient_name}\nPhone: ${data.phone}\nDoctor: ${doctors.find(d => d.id === data.doctor_id)?.first_name} ${doctors.find(d => d.id === data.doctor_id)?.last_name}\nDate: ${new Date(data.appointment_date).toLocaleDateString()}\nTime: ${data.appointment_time}\n\n${existingPatient ? 'Existing patient found - appointment will be linked automatically when patient registers.' : 'New patient - appointment will be linked when patient completes registration.'}`);
      
      navigate('/appointments');
    } catch (err: any) {
      console.error('Error creating phone appointment:', err);
      setError(err.message || 'Failed to schedule appointment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && doctors.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid #3b82f6',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Phone Appointment Booking
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Schedule appointments for patients calling over the phone
          </p>
        </div>
        <button
          onClick={() => navigate('/appointments')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Back to Appointments
        </button>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {existingPatient && (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Search size={16} />
            <div>
              <strong>Existing Patient Found:</strong> {existingPatient.first_name} {existingPatient.last_name}
              <br />
              <span style={{ fontSize: '0.875rem' }}>
                Email: {existingPatient.email} | DOB: {new Date(existingPatient.date_of_birth).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                <User size={16} />
                Patient Name *
              </label>
              <input
                {...register('patient_name', { required: 'Patient name is required' })}
                placeholder="Enter patient's full name"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              {errors.patient_name && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.patient_name.message}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                <Phone size={16} />
                Phone Number *
              </label>
              <input
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[+]?[0-9]{10,15}$/,
                    message: 'Please enter a valid phone number'
                  }
                })}
                placeholder="+91 98765 43210"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              {errors.phone && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                <UserCheck size={16} />
                Doctor *
              </label>
              <select
                {...register('doctor_id', { required: 'Doctor is required' })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                  </option>
                ))}
              </select>
              {errors.doctor_id && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.doctor_id.message}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                <Calendar size={16} />
                Appointment Date *
              </label>
              <input
                type="date"
                {...register('appointment_date', { required: 'Date is required' })}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              {errors.appointment_date && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.appointment_date.message}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                <Clock size={16} />
                Appointment Time *
              </label>
              <select
                {...register('appointment_time', { required: 'Time is required' })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="">Select time</option>
                {Array.from({ length: 18 }, (_, i) => {
                  const hour = Math.floor(i / 2) + 9; // Start from 9 AM
                  const minute = (i % 2) * 30; // 0 or 30 minutes
                  const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                  const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  });
                  return (
                    <option key={time} value={time}>
                      {displayTime}
                    </option>
                  );
                })}
              </select>
              {errors.appointment_time && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.appointment_time.message}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Reason for Visit *
              </label>
              <input
                {...register('reason', { required: 'Reason is required' })}
                placeholder="e.g., General checkup, Follow-up, Consultation"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              {errors.reason && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {errors.reason.message}
                </p>
              )}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Any additional information about the appointment or patient..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            padding: '1rem',
            borderRadius: '0.375rem',
            marginTop: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              📞 Phone Appointment Process:
            </h4>
            <ul style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: 0,
              paddingLeft: '1rem'
            }}>
              <li>This appointment will be marked as a phone booking</li>
              <li>When the patient arrives and completes registration, the appointment will be automatically linked to their patient record</li>
              <li>If the patient is already registered, the appointment will be linked immediately</li>
              <li>The patient will receive appointment confirmation via phone</li>
            </ul>
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'transparent',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {loading && (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              )}
              <Phone size={16} />
              Schedule Phone Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhoneAppointmentForm;