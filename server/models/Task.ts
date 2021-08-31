import mongoose from 'mongoose';
import ProjectSchema from './Project';

const TaskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.ObjectId,
      ref: ProjectSchema.modelName,
      required: true,
    },
    taskName: { type: String, required: true },
    taskDesc: { type: String, required: true },
    startDate: { type: Date, required: true },
    weeksArr: { type: Array, required: true },
    endDate: { type: Date, required: true },
    startYear: { type: String, required: true },
    endYear: { type: String, required: true },
  },
  { strict: false },
);

export default mongoose.model('tasks', TaskSchema);
