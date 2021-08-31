import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema(
  {
    _id: String,
    sequence_value: {
      type: Number,
      default: 100000000000000,
    },
  },
  { strict: false, timestamp: true },
);

const Counter = mongoose.model('counters', CounterSchema);

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
