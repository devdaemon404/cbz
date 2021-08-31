import mongoose from 'mongoose';

const RecordTimesheetsSchema = new mongoose.Schema(
  {
    projectManagerId: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
    },
    projectId: {
      type: mongoose.Schema.ObjectId,
      ref: 'projects',
    },
    month: String,
    year: String,
    totalWeeks: Number,
    weekNumber: Number,
    description: String,
    open: {
      type: Boolean,
      default: true,
    },
  },
  { strict: false, timestamps: true },
);

export default mongoose.model('record-timesheets', RecordTimesheetsSchema);
