const express = require('express');
const MedicalRecord = require('../models/MedicalRecord');
const router = express.Router();

// Get all medical records
router.get('/', async (req, res) => {
  try {
    const records = await MedicalRecord.find()
      .populate('patient', 'firstName lastName email')
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment')
      .sort({ visitDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get medical records by patient ID
router.get('/patient/:patientId', async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment')
      .sort({ visitDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get medical record by ID
router.get('/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient')
      .populate('doctor')
      .populate('appointment');
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new medical record
router.post('/', async (req, res) => {
  try {
    const record = new MedicalRecord(req.body);
    const savedRecord = await record.save();
    const populatedRecord = await MedicalRecord.findById(savedRecord._id)
      .populate('patient', 'firstName lastName email')
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment');
    res.status(201).json(populatedRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update medical record
router.put('/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patient', 'firstName lastName email')
     .populate('doctor', 'firstName lastName specialization')
     .populate('appointment');
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete medical record
router.delete('/:id', async (req, res) => {
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

module.exports = router;