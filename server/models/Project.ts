import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    project_name: {
      type: String,
      default: 'default',
    },
    numeric_id: {
      type: Number,
      required: true,
    },
    client: {
      type: mongoose.Schema.ObjectId,
      ref: 'clients',
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
      default: 'project',
    },
  },
  { strict: false },
);

export default mongoose.model('projects', ProjectSchema);
