import mongoose from 'mongoose';
import ClientSchema from './Client';

const countSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.ObjectId,
    ref: ClientSchema.modelName,
    required: true,
  },
  count: {
    type: Number,
    default: 8100001,
  },
});

export default mongoose.model('work_order_count', countSchema);
