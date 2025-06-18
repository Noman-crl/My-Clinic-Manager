const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  visitDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  chiefComplaint: {
    type: String,
    required: true,
    trim: true
  },
  historyOfPresentIllness: {
    type: String,
    trim: true
  },
  physicalExamination: {
    vitalSigns: {
      temperature: Number,
      bloodPressure: String,
      heartRate: Number,
      respiratoryRate: Number,
      oxygenSaturation: Number,
      weight: Number,
      height: Number
    },
    generalAppearance: String,
    systemicExamination: String
  },
  investigations: [{
    testName: String,
    result: String,
    date: Date,
    normalRange: String,
    status: {
      type: String,
      enum: ['ordered', 'completed', 'pending'],
      default: 'ordered'
    }
  }],
  diagnosis: {
    primary: String,
    secondary: [String],
    differential: [String]
  },
  treatment: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    procedures: [String],
    recommendations: [String]
  },
  followUp: {
    required: Boolean,
    date: Date,
    instructions: String
  },
  attachments: [{
    filename: String,
    path: String,
    type: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);