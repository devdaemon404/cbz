import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema(
  {
    client_name: {
      type: String,
      required: true,
    },
    adminUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
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
      default: 'client',
    },
  },
  { strict: false },
);

export default mongoose.model('clients', ClientSchema);
