const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
  dateTime: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Checkup', 'Consultation', 'Follow-up', 'Emergency']
  },
  status: {
    type: String,
    required: true,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
    default: 'Scheduled'
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
appointmentSchema.index({ dateTime: 1, doctor: 1 });
appointmentSchema.index({ patient: 1, dateTime: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema); 