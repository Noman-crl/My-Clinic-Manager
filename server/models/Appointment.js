const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // 14:30
  duration: { type: Number, default: 30 }, // minutes
  status: { 
    type: String, 
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'], 
    default: 'scheduled' 
  },
  type: { 
    type: String, 
    enum: ['consultation', 'follow-up', 'checkup', 'emergency', 'procedure'], 
    required: true 
  },
  reason: { type: String, required: true },
  notes: String,
  symptoms: [String],
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  reminderSent: { type: Boolean, default: false },
  cancelledBy: { type: String, enum: ['patient', 'doctor', 'admin'] },
  cancellationReason: String,
  rescheduledFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }
}, { timestamps: true });

// Index for efficient querying
appointmentSchema.index({ doctorId: 1, date: 1, time: 1 });
appointmentSchema.index({ patientId: 1, date: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);