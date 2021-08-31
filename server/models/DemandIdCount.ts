import mongoose from 'mongoose';

const DemandCountSchema = new mongoose.Schema({
  client: {},
  sequence: Number,
});

const DemandCount = mongoose.model(
  'client_demand_request_id_sequence',
  DemandCountSchema,
  'client_demand_request_id_sequence',
);

export default DemandCount;
