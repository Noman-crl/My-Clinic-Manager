const mongoose = require('mongoose');

const doctorScheduleSchema = new mongoose.Schema({
  day: { type: String, required: true }, // Monday, Tuesday, etc.
  startTime: { type: String, required: true }, // 09:00
  endTime: { type: String, required: true }, // 17:00
  isAvailable: { type: Boolean, default: true }
});

const doctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  experience: { type: Number, required: true }, // years
  consultationFee: { type: Number, required: true },
  qualifications: [String],
  schedule: [doctorScheduleSchema],
  isActive: { type: Boolean, default: true },
  profileImage: String,
  bio: String,
  languages: [String]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);