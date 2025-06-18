const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true },
  items: [invoiceItemSchema],
  subtotal: { type: Number, required: true },
  taxRate: { type: Number, default: 0 }, // percentage
  taxAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'pending', 'paid', 'overdue', 'cancelled'], 
    default: 'draft' 
  },
  paymentMethod: String,
  paidAt: Date,
  paidAmount: { type: Number, default: 0 },
  notes: String,
  insuranceClaim: {
    claimNumber: String,
    insuranceProvider: String,
    claimAmount: Number,
    claimStatus: { type: String, enum: ['pending', 'approved', 'denied', 'processing'] },
    claimDate: Date
  }
}, { timestamps: true });

// Auto-generate invoice number
invoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `INV-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);