import mongoose from 'mongoose';

const RecruitmentSchema = new mongoose.Schema({
  demand: {},
  client: {},
});

export default mongoose.model(
  'recruitments',
  RecruitmentSchema,
  'recruitments',
);
