import { Patient, Doctor, Appointment, MedicalRecord, Invoice } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    address: '123 Main St, Anytown, USA 12345',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+1 (555) 987-6543',
    insuranceNumber: 'INS123456789',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.johnson@email.com',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '1992-03-22',
    gender: 'female',
    address: '456 Oak Ave, Somewhere, USA 67890',
    emergencyContact: 'Michael Johnson',
    emergencyPhone: '+1 (555) 876-5432',
    insuranceNumber: 'INS987654321',
    createdAt: '2024-01-10T14:20:00Z'
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'robert.wilson@email.com',
    phone: '+1 (555) 345-6789',
    dateOfBirth: '1978-11-08',
    gender: 'male',
    address: '789 Pine St, Elsewhere, USA 13579',
    emergencyContact: 'Sarah Wilson',
    emergencyPhone: '+1 (555) 765-4321',
    createdAt: '2024-01-05T09:15:00Z'
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    firstName: 'Dr. Sarah',
    lastName: 'Smith',
    email: 'sarah.smith@clinic.com',
    phone: '+1 (555) 111-2222',
    specialization: 'Cardiology',
    licenseNumber: 'MD123456',
    experience: 8,
    consultationFee: 200,
    schedule: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Friday', startTime: '09:00', endTime: '15:00', isAvailable: true }
    ],
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: '2',
    firstName: 'Dr. Michael',
    lastName: 'Brown',
    email: 'michael.brown@clinic.com',
    phone: '+1 (555) 222-3333',
    specialization: 'Pediatrics',
    licenseNumber: 'MD789012',
    experience: 12,
    consultationFee: 180,
    schedule: [
      { day: 'Monday', startTime: '08:00', endTime: '16:00', isAvailable: true },
      { day: 'Tuesday', startTime: '08:00', endTime: '16:00', isAvailable: true },
      { day: 'Wednesday', startTime: '08:00', endTime: '16:00', isAvailable: true },
      { day: 'Thursday', startTime: '08:00', endTime: '16:00', isAvailable: true },
      { day: 'Friday', startTime: '08:00', endTime: '14:00', isAvailable: true }
    ],
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: '3',
    firstName: 'Dr. Lisa',
    lastName: 'Davis',
    email: 'lisa.davis@clinic.com',
    phone: '+1 (555) 333-4444',
    specialization: 'Dermatology',
    licenseNumber: 'MD345678',
    experience: 6,
    consultationFee: 150,
    schedule: [
      { day: 'Tuesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { day: 'Wednesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { day: 'Thursday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { day: 'Friday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { day: 'Saturday', startTime: '09:00', endTime: '13:00', isAvailable: true }
    ],
    createdAt: '2024-01-01T08:00:00Z'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2024-01-20',
    time: '10:00',
    status: 'scheduled',
    reason: 'Regular checkup',
    notes: 'Patient reports chest pain',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    date: '2024-01-18',
    time: '14:30',
    status: 'completed',
    reason: 'Child vaccination',
    createdAt: '2024-01-10T14:20:00Z'
  },
  {
    id: '3',
    patientId: '3',
    doctorId: '3',
    date: '2024-01-22',
    time: '11:15',
    status: 'scheduled',
    reason: 'Skin examination',
    createdAt: '2024-01-05T09:15:00Z'
  }
];

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '2',
    doctorId: '2',
    appointmentId: '2',
    date: '2024-01-18',
    diagnosis: 'Routine vaccination - MMR booster',
    treatment: 'MMR vaccination administered',
    medications: [],
    notes: 'No adverse reactions observed. Next vaccination due in 6 months.',
    followUpDate: '2024-07-18'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    patientId: '2',
    appointmentId: '2',
    date: '2024-01-18',
    items: [
      { description: 'Pediatric Consultation', quantity: 1, unitPrice: 180, total: 180 },
      { description: 'MMR Vaccination', quantity: 1, unitPrice: 50, total: 50 }
    ],
    subtotal: 230,
    tax: 23,
    total: 253,
    status: 'paid',
    paidAt: '2024-01-18T16:00:00Z',
    paymentMethod: 'Credit Card'
  },
  {
    id: '2',
    patientId: '1',
    appointmentId: '1',
    date: '2024-01-20',
    items: [
      { description: 'Cardiology Consultation', quantity: 1, unitPrice: 200, total: 200 },
      { description: 'ECG Test', quantity: 1, unitPrice: 75, total: 75 }
    ],
    subtotal: 275,
    tax: 27.5,
    total: 302.5,
    status: 'pending'
  }
];