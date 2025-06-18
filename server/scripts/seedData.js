require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Invoice = require('../models/Invoice');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Patient.deleteMany({}),
      Doctor.deleteMany({}),
      Appointment.deleteMany({}),
      MedicalRecord.deleteMany({}),
      Invoice.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Seed Doctors
    const doctors = await Doctor.insertMany([
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@clinic.com',
        phone: '+1234567890',
        specialization: 'Cardiology',
        licenseNumber: 'MD001',
        experience: 15,
        consultationFee: 200,
        qualifications: ['MD', 'FACC'],
        schedule: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { day: 'Friday', startTime: '09:00', endTime: '15:00', isAvailable: true }
        ],
        bio: 'Experienced cardiologist with 15 years of practice.',
        languages: ['English', 'Spanish']
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@clinic.com',
        phone: '+1234567891',
        specialization: 'Pediatrics',
        licenseNumber: 'MD002',
        experience: 10,
        consultationFee: 150,
        qualifications: ['MD', 'FAAP'],
        schedule: [
          { day: 'Monday', startTime: '08:00', endTime: '16:00', isAvailable: true },
          { day: 'Tuesday', startTime: '08:00', endTime: '16:00', isAvailable: true },
          { day: 'Wednesday', startTime: '08:00', endTime: '16:00', isAvailable: true },
          { day: 'Thursday', startTime: '08:00', endTime: '16:00', isAvailable: true },
          { day: 'Friday', startTime: '08:00', endTime: '14:00', isAvailable: true }
        ],
        bio: 'Dedicated pediatrician specializing in child healthcare.',
        languages: ['English']
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@clinic.com',
        phone: '+1234567892',
        specialization: 'Orthopedics',
        licenseNumber: 'MD003',
        experience: 20,
        consultationFee: 250,
        qualifications: ['MD', 'FAAOS'],
        schedule: [
          { day: 'Monday', startTime: '10:00', endTime: '18:00', isAvailable: true },
          { day: 'Tuesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
          { day: 'Wednesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
          { day: 'Thursday', startTime: '10:00', endTime: '18:00', isAvailable: true }
        ],
        bio: 'Orthopedic surgeon with expertise in joint replacement.',
        languages: ['English', 'French']
      }
    ]);
    console.log('Seeded doctors');

    // Seed Patients
    const patients = await Patient.insertMany([
      {
        firstName: 'Alice',
        lastName: 'Wilson',
        email: 'alice.wilson@email.com',
        phone: '+1234567893',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'female',
        address: '123 Main St, City, State 12345',
        emergencyContact: 'Bob Wilson',
        emergencyPhone: '+1234567894',
        insuranceNumber: 'INS001',
        bloodType: 'A+',
        height: 165,
        weight: 60,
        allergies: ['Penicillin'],
        medicalHistory: [
          {
            condition: 'Hypertension',
            diagnosedDate: new Date('2020-01-15'),
            status: 'active'
          }
        ]
      },
      {
        firstName: 'Robert',
        lastName: 'Davis',
        email: 'robert.davis@email.com',
        phone: '+1234567895',
        dateOfBirth: new Date('1978-07-22'),
        gender: 'male',
        address: '456 Oak Ave, City, State 12345',
        emergencyContact: 'Mary Davis',
        emergencyPhone: '+1234567896',
        insuranceNumber: 'INS002',
        bloodType: 'O-',
        height: 180,
        weight: 85,
        allergies: [],
        medicalHistory: []
      },
      {
        firstName: 'Emma',
        lastName: 'Thompson',
        email: 'emma.thompson@email.com',
        phone: '+1234567897',
        dateOfBirth: new Date('2010-12-08'),
        gender: 'female',
        address: '789 Pine St, City, State 12345',
        emergencyContact: 'James Thompson',
        emergencyPhone: '+1234567898',
        insuranceNumber: 'INS003',
        bloodType: 'B+',
        height: 140,
        weight: 35,
        allergies: ['Nuts'],
        medicalHistory: [
          {
            condition: 'Asthma',
            diagnosedDate: new Date('2015-05-10'),
            status: 'active'
          }
        ]
      }
    ]);
    console.log('Seeded patients');

    // Seed Appointments
    const appointments = await Appointment.insertMany([
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        date: new Date(),
        time: '10:00',
        type: 'consultation',
        reason: 'Regular checkup',
        status: 'scheduled',
        priority: 'medium'
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[2]._id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        time: '14:00',
        type: 'consultation',
        reason: 'Knee pain',
        status: 'scheduled',
        priority: 'high'
      },
      {
        patientId: patients[2]._id,
        doctorId: doctors[1]._id,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        time: '09:30',
        type: 'follow-up',
        reason: 'Asthma follow-up',
        status: 'scheduled',
        priority: 'medium'
      }
    ]);
    console.log('Seeded appointments');

    // Seed Medical Records
    const medicalRecords = await MedicalRecord.insertMany([
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        appointmentId: appointments[0]._id,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        chiefComplaint: 'Chest pain',
        diagnosis: 'Stable angina',
        treatment: 'Medication and lifestyle changes',
        vitalSigns: {
          bloodPressure: '140/90',
          heartRate: 75,
          temperature: 98.6,
          weight: 60,
          height: 165
        },
        medications: [
          {
            name: 'Metoprolol',
            dosage: '50mg',
            frequency: 'Twice daily',
            duration: '30 days',
            instructions: 'Take with food'
          }
        ],
        followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        notes: 'Patient responding well to treatment'
      }
    ]);
    console.log('Seeded medical records');

    // Seed Invoices
    const invoices = await Invoice.insertMany([
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        appointmentId: appointments[0]._id,
        date: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [
          {
            description: 'Consultation Fee',
            quantity: 1,
            unitPrice: 200,
            total: 200
          },
          {
            description: 'ECG Test',
            quantity: 1,
            unitPrice: 50,
            total: 50
          }
        ],
        subtotal: 250,
        taxRate: 8,
        taxAmount: 20,
        total: 270,
        status: 'pending'
      }
    ]);
    console.log('Seeded invoices');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedData();