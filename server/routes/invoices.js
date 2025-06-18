const express = require('express');
const Invoice = require('../models/Invoice');
const router = express.Router();

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('patient', 'firstName lastName email')
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment')
      .sort({ issueDate: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('patient')
      .populate('doctor')
      .populate('appointment');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new invoice
router.post('/', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    const savedInvoice = await invoice.save();
    const populatedInvoice = await Invoice.findById(savedInvoice._id)
      .populate('patient', 'firstName lastName email')
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment');
    res.status(201).json(populatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patient', 'firstName lastName email')
     .populate('doctor', 'firstName lastName specialization')
     .populate('appointment');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;