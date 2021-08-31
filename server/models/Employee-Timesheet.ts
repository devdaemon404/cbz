import mongoose from 'mongoose';

const EmpTimesheetsSchema = new mongoose.Schema(
  {
    recordTimesheet: {
      type: mongoose.Schema.ObjectId,
      ref: 'record-timesheets',
    },
    projectId: {
      type: mongoose.Schema.ObjectId,
      ref: 'projects',
    },
    employeeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'employees',
    },
    approval: {
      type: Boolean,
      default: false,
    },
    week: {
      Sun: {
        day: String,
        date: Date,
        hrs: {
          type: Number,
          min: 0,
          max: 24,
          default: 0,
        },
        active: Number,
        comments: String,
      },
      Mon: {
        day: String,
        date: Date,
        hrs: {
          type: Number,
          min: 0,
          max: 24,
          default: 0,
        },
        active: Number,
        comments: String,
      },
      Tue: {
        day: String,
        date: Date,
        hrs: {
          type: Number,
          min: 0,
          max: 24,
          default: 0,
        },
        active: Number,
        comments: String,
      },
      Wed: {
        day: String,
        date: Date,
        hrs: {
          type: Number,
          min: 0,
          max: 24,
          default: 0,
        },
        active: Number,
        comments: String,
      },
      Thurs: {
        day: String,
        date: Date,
        hrs: {
          type: Number,
          min: 0,
          max: 24,
          default: 0,
        },
        active: Number,
        comments: String,
      },
      Fri: {
        day: String,
        date: Date,
        hrs: {
          type: Number,
          min: 0,
          max: 24,
          default: 0,
        },
        active: Number,
        comments: String,
      },
      Sat: {
        day: String,
        date: Date,
        hrs: {
          type: Number,
          min: 0,
          max: 24,
          default: 0,
        },
        active: Number,
        comments: String,
      },
    },
  },
  { strict: false, timestamps: true },
);

export default mongoose.model('emp-timesheets', EmpTimesheetsSchema);
