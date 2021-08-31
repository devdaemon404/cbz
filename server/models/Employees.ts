import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema(
  {
    employee_id: { type: Number, required: true },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      required: true,
    },
    profile: {
      type: mongoose.Schema.ObjectId,
      ref: 'profiles',
      required: true,
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'projects',
      required: true,
    },
    vendor: {
      type: mongoose.Schema.ObjectId,
      ref: 'vendors',
      required: true,
    },
    created: {
      type: Date,
      default: Date.now(),
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
      default: 'employee',
    },
  },
  { strict: false },
);

export default mongoose.model('employees', EmployeeSchema);
