import { create } from 'zustand';
import { Patient, Doctor, Appointment, MedicalRecord, Invoice } from '../types';

interface ClinicStore {
  // State
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  invoices: Invoice[];
  
  // Patient actions
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  
  // Doctor actions
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  
  // Appointment actions
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  
  // Medical Record actions
  addMedicalRecord: (record: MedicalRecord) => void;
  updateMedicalRecord: (id: string, record: Partial<MedicalRecord>) => void;
  deleteMedicalRecord: (id: string) => void;
  
  // Invoice actions
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
}

export const useClinicStore = create<ClinicStore>((set) => ({
  // Initial state
  patients: [],
  doctors: [],
  appointments: [],
  medicalRecords: [],
  invoices: [],
  
  // Patient actions
  addPatient: (patient) =>
    set((state) => ({
      patients: [...state.patients, patient],
    })),
  updatePatient: (id, patient) =>
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, ...patient } : p
      ),
    })),
  deletePatient: (id) =>
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
    })),
  
  // Doctor actions
  addDoctor: (doctor) =>
    set((state) => ({
      doctors: [...state.doctors, doctor],
    })),
  updateDoctor: (id, doctor) =>
    set((state) => ({
      doctors: state.doctors.map((d) =>
        d.id === id ? { ...d, ...doctor } : d
      ),
    })),
  deleteDoctor: (id) =>
    set((state) => ({
      doctors: state.doctors.filter((d) => d.id !== id),
    })),
  
  // Appointment actions
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),
  updateAppointment: (id, appointment) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, ...appointment } : a
      ),
    })),
  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id),
    })),
  
  // Medical Record actions
  addMedicalRecord: (record) =>
    set((state) => ({
      medicalRecords: [...state.medicalRecords, record],
    })),
  updateMedicalRecord: (id, record) =>
    set((state) => ({
      medicalRecords: state.medicalRecords.map((r) =>
        r.id === id ? { ...r, ...record } : r
      ),
    })),
  deleteMedicalRecord: (id) =>
    set((state) => ({
      medicalRecords: state.medicalRecords.filter((r) => r.id !== id),
    })),
  
  // Invoice actions
  addInvoice: (invoice) =>
    set((state) => ({
      invoices: [...state.invoices, invoice],
    })),
  updateInvoice: (id, invoice) =>
    set((state) => ({
      invoices: state.invoices.map((i) =>
        i.id === id ? { ...i, ...invoice } : i
      ),
    })),
  deleteInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((i) => i.id !== id),
    })),
})); 