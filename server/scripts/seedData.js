const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic-management');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});

    // Seed doctors
    const doctors = await Doctor.insertMany([
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@clinic.com',
        phone: '+1-555-0101',
        specialization: 'Cardiology',
        licenseNumber: 'MD001',
        experience: 15,
        consultationFee: 200,
        schedule: {
          monday: { start: '09:00', end: '17:00', available: true },
          tuesday: { start: '09:00', end: '17:00', available: true },
          wednesday: { start: '09:00', end: '17:00', available: true },
          thursday: { start: '09:00', end: '17:00', available: true },
          friday: { start: '09:00', end: '17:00', available: true },
          saturday: { start: '09:00', end: '13:00', available: true },
          sunday: { start: '', end: '', available: false }
        }
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@clinic.com',
        phone: '+1-555-0102',
        specialization: 'Pediatrics',
        licenseNumber: 'MD002',
        experience: 12,
        consultationFee: 180,
        schedule: {
          monday: { start: '08:00', end: '16:00', available: true },
          tuesday: { start: '08:00', end: '16:00', available: true },
          wednesday: { start: '08:00', end: '16:00', available: true },
          thursday: { start: '08:00', end: '16:00', available: true },
          friday: { start: '08:00', end: '16:00', available: true },
          saturday: { start: '', end: '', available: false },
          sunday: { start: '', end: '', available: false }
        }
      }
    ]);

    // Seed patients
    const patients = await Patient.insertMany([
      {
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice.brown@email.com',
        phone: '+1-555-0201',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'female',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        emergencyContact: {
          name: 'Bob Brown',
          relationship: 'Spouse',
          phone: '+1-555-0202'
        }
      },
      {
        firstName: 'Michael',
        lastName: 'Davis',
        email: 'michael.davis@email.com',
        phone: '+1-555-0203',
        dateOfBirth: new Date('1978-07-22'),
        gender: 'male',
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA'
        },
        emergencyContact: {
          name: 'Lisa Davis',
          relationship: 'Spouse',
          phone: '+1-555-0204'
        }
      }
    ]);

    console.log('Sample data seeded successfully');
    console.log(`Created ${doctors.length} doctors and ${patients.length} patients`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();