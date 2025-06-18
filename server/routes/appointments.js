const express = require('express');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all appointments
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      date, 
      doctorId, 
      patientId, 
      status,
      startDate,
      endDate
    } = req.query;
    
    const query = {};
    
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    
    if (startDate && endDate) {
      query.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    if (doctorId) query.doctorId = doctorId;
    if (patientId) query.patientId = patientId;
    if (status) query.status = status;
    
    const appointments = await Appointment.find(query)
      .populate('patientId', 'firstName lastName email phone')
      .populate('doctorId', 'firstName lastName specialization')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: 1, time: 1 });
      
    const total = await Appointment.countDocuments(query);
    
    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId');
      
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new appointment
router.post('/', auth, async (req, res) => {
  try {
    const { patientId, doctorId, date, time } = req.body;
    
    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      time,
      status: { $nin: ['cancelled', 'no-show'] }
    });
    
    if (conflictingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }
    
    const appointment = new Appointment(req.body);
    await appointment.save();
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'firstName lastName email phone')
      .populate('doctorId', 'firstName lastName specialization');
    
    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update appointment
router.put('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patientId', 'firstName lastName email phone')
     .populate('doctorId', 'firstName lastName specialization');
     
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel appointment
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const { cancelledBy, cancellationReason } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'cancelled',
        cancelledBy,
        cancellationReason
      },
      { new: true }
    ).populate('patientId', 'firstName lastName email phone')
     .populate('doctorId', 'firstName lastName specialization');
     
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Reschedule appointment
router.patch('/:id/reschedule', auth, async (req, res) => {
  try {
    const { date, time } = req.body;
    const originalAppointment = await Appointment.findById(req.params.id);
    
    if (!originalAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check for conflicts
    const conflictingAppointment = await Appointment.findOne({
      doctorId: originalAppointment.doctorId,
      date: new Date(date),
      time,
      status: { $nin: ['cancelled', 'no-show'] },
      _id: { $ne: req.params.id }
    });
    
    if (conflictingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { date: new Date(date), time },
      { new: true }
    ).populate('patientId', 'firstName lastName email phone')
     .populate('doctorId', 'firstName lastName specialization');
     
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get today's appointments
router.get('/today/list', auth, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    const appointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled'] }
    })
    .populate('patientId', 'firstName lastName phone')
    .populate('doctorId', 'firstName lastName specialization')
    .sort({ time: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointment statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled'] }
    });
    
    const monthlyAppointments = await Appointment.countDocuments({
      date: { $gte: startOfMonth },
      status: { $nin: ['cancelled'] }
    });
    
    const statusStats = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const typeStats = await Appointment.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      todayAppointments,
      monthlyAppointments,
      statusStats,
      typeStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;