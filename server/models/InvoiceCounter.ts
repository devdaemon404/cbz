import mongoose from 'mongoose';

const InvoiceCounterSchema = new mongoose.Schema(
  {
    _id: String,
    sequence_value: {
      type: Number,
      default: 1,
    },
  },
  { strict: false, timestamp: true },
);

const Counter = mongoose.model('counters', InvoiceCounterSchema);

const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Counter.findByIdAndUpdate(
    {
      _id: sequenceName,
    },
    {
      $inc: { sequence_value: 1 },
    },
    { new: true },
  );
  return sequenceDocument.sequence_value;
};

export { Counter, getNextSequenceValue };
