import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'clients',
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'vendors',
      required: true,
    },
    fileKey: {
      type: String,
      required: true,
    },
    invoiceNumber: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    week: {
      type: Number,
    },
    year: {
      type: String,
    },
  },
  { timestamp: true },
);

export default mongoose.model('invoices', InvoiceSchema);
