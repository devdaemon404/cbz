import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      match: [
        /^([_a-zA-Z0-9-]+(\\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*(\\.[a-zA-Z]{1,6}))?$/,
        'Please add a valid email',
      ],
    },
    mobile: {
      type: String,
      required: [true, 'Please add an contact'],
      match: [/^[6-9]\\d{9}/, 'Please add a valid mobile'],
    },
    experience: {
      type: Number,
    },
    location: {
      type: String,
    },
    onboardingToken: {
      token: String,
      expiry: Date,
    },
    onboardingOtp: {
      otp: String,
      expiry: Date,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    updated: {
      type: Date,
      default: Date.now,
    },
    workOrderId: {
      type: mongoose.Schema.ObjectId,
      ref: 'workOrder',
    },
    workOrderExists: {
      type: Boolean,
      default: false,
    },
  },
  { strict: false },
);

export default mongoose.model('profiles', ProfileSchema);
