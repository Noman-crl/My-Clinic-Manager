const express = require('express');
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all invoices
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      patientId, 
      startDate, 
      endDate,
      search 
    } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (patientId) query.patientId = patientId;
    
    if (startDate && endDate) {
      query.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    if (search) {
      query.invoiceNumber = { $regex: search, $options: 'i' };
    }
    
    const invoices = await Invoice.find(query)
      .populate('patientId', 'firstName lastName email phone')
      .populate('doctorId', 'firstName lastName specialization')
      .populate('appointmentId', 'date time type')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });
      
    const total = await Invoice.countDocuments(query);
    
    res.json({
      invoices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get invoice by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId')
      .populate('appointmentId');
      
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new invoice
router.post('/', auth, async (req, res) => {
  try {
    // Calculate totals
    const { items, taxRate = 0, discountAmount = 0 } = req.body;
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount - discountAmount;
    
    const invoiceData = {
      ...req.body,
      subtotal,
      taxAmount,
      total,
      dueDate: req.body.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
    
    const invoice = new Invoice(invoiceData);
    await invoice.save();
    
    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('patientId', 'firstName lastName email')
      .populate('doctorId', 'firstName lastName')
      .populate('appointmentId', 'date time');
    
    res.status(201).json(populatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update invoice
router.put('/:id', auth, async (req, res) => {
  try {
    // Recalculate totals if items changed
    if (req.body.items) {
      const { items, taxRate = 0, discountAmount = 0 } = req.body;
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const taxAmount = (subtotal * taxRate) / 100;
      const total = subtotal + taxAmount - discountAmount;
      
      req.body.subtotal = subtotal;
      req.body.taxAmount = taxAmount;
      req.body.total = total;
    }
    
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patientId', 'firstName lastName email')
     .populate('doctorId', 'firstName lastName')
     .populate('appointmentId', 'date time');
     
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark invoice as paid
router.patch('/:id/pay', auth, async (req, res) => {
  try {
    const { paymentMethod, paidAmount } = req.body;
    
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'paid',
        paymentMethod,
        paidAmount: paidAmount || undefined,
        paidAt: new Date()
      },
      { new: true }
    ).populate('patientId', 'firstName lastName email')
     .populate('doctorId', 'firstName lastName');
     
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Send invoice
router.patch('/:id/send', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status: 'sent' },
      { new: true }
    ).populate('patientId', 'firstName lastName email');
     
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // TODO: Implement email sending logic here
    
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get invoice statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalRevenue = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const pendingAmount = await Invoice.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const overdueAmount = await Invoice.aggregate([
      { $match: { status: 'overdue' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const monthlyRevenue = await Invoice.aggregate([
      {
        $match: {
          status: 'paid',
          paidAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        }
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const statusStats = await Invoice.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingAmount: pendingAmount[0]?.total || 0,
      overdueAmount: overdueAmount[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      statusStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;