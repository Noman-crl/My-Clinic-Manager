const express = require('express');
const MedicalRecord = require('../models/MedicalRecord');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all medical records
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, patientId, doctorId, startDate, endDate } = req.query;
    const query = {};
    
    if (patientId) query.patientId = patientId;
    if (doctorId) query.doctorId = doctorId;
    
    if (startDate && endDate) {
      query.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    const records = await MedicalRecord.find(query)
      .populate('patientId', 'firstName lastName dateOfBirth')
      .populate('doctorId', 'firstName lastName specialization')
      .populate('appointmentId', 'date time type')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });
      
    const total = await MedicalRecord.countDocuments(query);
    
    res.json({
      records,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get medical record by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId')
      .populate('appointmentId');
      
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get patient's medical history
router.get('/patient/:patientId/history', auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 50 } = req.query;
    
    const records = await MedicalRecord.find({ patientId })
      .populate('doctorId', 'firstName lastName specialization')
      .populate('appointmentId', 'date time type')
      .limit(limit * 1)
      .sort({ date: -1 });
      
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new medical record
router.post('/', auth, async (req, res) => {
  try {
    const record = new MedicalRecord(req.body);
    await record.save();
    
    const populatedRecord = await MedicalRecord.findById(record._id)
      .populate('patientId', 'firstName lastName')
      .populate('doctorId', 'firstName lastName specialization')
      .populate('appointmentId', 'date time');
    
    res.status(201).json(populatedRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update medical record
router.put('/:id', auth, async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patientId', 'firstName lastName')
     .populate('doctorId', 'firstName lastName specialization')
     .populate('appointmentId', 'date time');
     
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete medical record
router.delete('/:id', auth, async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search medical records
router.get('/search/query', auth, async (req, res) => {
  try {
    const { q, patientId } = req.query;
    const query = {};
    
    if (patientId) query.patientId = patientId;
    
    if (q) {
      query.$or = [
        { diagnosis: { $regex: q, $options: 'i' } },
        { chiefComplaint: { $regex: q, $options: 'i' } },
        { treatment: { $regex: q, $options: 'i' } },
        { 'medications.name': { $regex: q, $options: 'i' } }
      ];
    }
    
    const records = await MedicalRecord.find(query)
      .populate('patientId', 'firstName lastName')
      .populate('doctorId', 'firstName lastName specialization')
      .sort({ date: -1 })
      .limit(20);
      
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;