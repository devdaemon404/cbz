import mongoose from 'mongoose';
import { type } from 'os';

const VendorSchema = new mongoose.Schema(
  {
    vendor_name: {
      type: String,
      required: true,
    },
    adminUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      required: true,
    },
    client: {
      type: mongoose.Schema.ObjectId,
      ref: 'clients',
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      match: [
        /^([_a-zA-Z0-9-]+(\\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*(\\.[a-zA-Z]{1,6}))?$/,
        'Please add a valid email',
      ],
    },
    mobile: {
      type: String,
      required: [true, 'Please add an contact'],
      match: [/^[6-9]\\d{9}/, 'Please add a valid mobile'],
    },
    invoiceDocuments: [
      {
        type: String,
      },
    ],
    created: {
      type: Date,
      default: Date.now,
    },
    updated: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    _class: {
      type: String,
      default: 'vendor',
    },
  },
  { strict: false },
);

export default mongoose.model('vendors', VendorSchema);
