const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  instructions: String
});

const vitalSignsSchema = new mongoose.Schema({
  bloodPressure: String, // 120/80
  heartRate: Number,
  temperature: Number,
  weight: Number,
  height: Number,
  respiratoryRate: Number,
  oxygenSaturation: Number
});

const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  date: { type: Date, required: true },
  chiefComplaint: { type: String, required: true },
  historyOfPresentIllness: String,
  physicalExamination: String,
  vitalSigns: vitalSignsSchema,
  diagnosis: { type: String, required: true },
  differentialDiagnosis: [String],
  treatment: { type: String, required: true },
  medications: [medicationSchema],
  labTests: [{
    testName: String,
    result: String,
    normalRange: String,
    date: Date
  }],
  imaging: [{
    type: String, // X-ray, MRI, CT, etc.
    result: String,
    date: Date,
    imageUrl: String
  }],
  notes: String,
  followUpDate: Date,
  followUpInstructions: String,
  referrals: [{
    specialistType: String,
    doctorName: String,
    reason: String,
    date: Date
  }],
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadDate: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);