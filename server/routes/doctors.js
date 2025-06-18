const express = require('express');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all doctors
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, specialization, isActive } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (specialization) query.specialization = { $regex: specialization, $options: 'i' };
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const doctors = await Doctor.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    const total = await Doctor.countDocuments(query);
    
    res.json({
      doctors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new doctor
router.post('/', auth, async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ message: `${field} already exists` });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Update doctor
router.put('/:id', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete doctor (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor availability
router.get('/:id/availability', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const schedule = doctor.schedule.find(s => s.day === dayOfWeek && s.isAvailable);
    
    if (!schedule) {
      return res.json({ available: false, slots: [] });
    }
    
    // Generate time slots (30-minute intervals)
    const slots = [];
    const startTime = new Date(`2000-01-01 ${schedule.startTime}`);
    const endTime = new Date(`2000-01-01 ${schedule.endTime}`);
    
    while (startTime < endTime) {
      slots.push(startTime.toTimeString().slice(0, 5));
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
    
    // TODO: Remove booked slots by checking appointments
    
    res.json({ available: true, slots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments({ isActive: true });
    const specializations = await Doctor.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const experienceGroups = await Doctor.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$experience', 5] }, then: '0-4 years' },
                { case: { $lt: ['$experience', 10] }, then: '5-9 years' },
                { case: { $lt: ['$experience', 20] }, then: '10-19 years' }
              ],
              default: '20+ years'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      totalDoctors,
      specializations,
      experienceGroups
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;