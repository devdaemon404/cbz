import mongoose from 'mongoose';

const DemandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    profileName: { type: String, required: true },
    quantity: { type: Number, required: true },
    startDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    hoursPerWeek: { type: Number, required: true },
    poNumber: { type: String, required: true },
    expense: { type: String, required: true },
    skills: {
      primarySkills: { type: Array, default: [] },
      secondarySkills: { type: Array, default: [] },
      relevantExperience: { type: Number, required: true },
      totalExperience: { type: Number, required: true },
      additionalSkills: { type: Array, default: [] },
    },
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
    jobDescription: { type: String, required: true },
    client: { type: {}, required: true },
    project: { type: {}, required: true },
    user: { type: {}, required: true },
    requestId: { type: Number, required: true },
    summary: { type: {} },
    additionalInfo: { type: {} },
    enabled: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    vendors: { type: Array },
    status: { type: String },
  },
  { strict: false },
);

export default mongoose.model('demands', DemandSchema);
