import mongoose from 'mongoose';
import ClientSchema from './Client';
import Demand from './Demand';
import VendorSchema from './Vendor';

const StringObj = { type: String, required: true };

export enum WorkOrderStatuses {
  APPROVED = 'APPROVED',
  DROPPED = 'DROPPED',
  AMEND = 'AMEND',
  REVIEW = 'REVIEW',
}

export enum Roles {
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  CLIENT_MANAGER = 'CLIENT_MANAGER',
  VICE_PRESIDENT = 'VICE_PRESIDENT',
  VENDOR_ADMIN = 'VENDOR_ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export namespace Roles {
  export const getNextRole = (currRole: Roles | string): Roles | null => {
    if (currRole === Roles.CLIENT_MANAGER) return Roles.VICE_PRESIDENT;
    return null;
  };

  export const parse = (currRole: string): String => {
    switch (currRole) {
      case 'PROJECT_MANAGER':
        return 'PM';
      case 'VICE_PRESIDENT':
        return 'VP';
      case 'VENDOR_ADMIN':
        return 'VA';
    }
    return '';
  };

  export const toString = (currRole: Roles): string => {
    return Roles[currRole];
  };
}

const WorkOrderSchema = new mongoose.Schema(
  {
    data: {
      version: {
        type: Number,
        default: 0,
        required: true,
      },
      changes: {
        type: Array,
        default: [],
        required: true,
      },
      officialEmail: String,
      requestedResource: StringObj,
      id: StringObj,
      posTitle: StringObj,
      posId: StringObj,
      posReportsTo: StringObj,
      jobType: StringObj,
      rateType: StringObj,
      // assignmentDesc: StringObj,
      startDate: { type: Date, required: true },
      duration: StringObj,
      endDate: { type: Date, required: true },
      // estimatedTotalSpend: StringObj,
      // contractedFee: StringObj,
      // estimatedRemainingBudget: StringObj,
      // allowExpenses: { type: Boolean, required: true },
      cvLink: String,
      vendor: {
        type: mongoose.Schema.ObjectId,
        ref: VendorSchema.modelName,
      },
      client: {
        type: mongoose.Schema.ObjectId,
        ref: ClientSchema.modelName,
      },
      demand: {
        type: mongoose.Schema.ObjectId,
        ref: Demand.modelName,
      },
      profile: {
        type: mongoose.Schema.ObjectId,
        ref: 'profiles',
      },
    },
    status: {
      type: String,
      enum: ['APPROVED', 'DROPPED', 'AMEND', 'REVIEW'],
      default: WorkOrderStatuses.REVIEW,
    },
    suggestions: [
      {
        id: {
          type: mongoose.Schema.ObjectId,
          ref: 'users',
        },
        suggestion: {
          type: String,
        },
      },
    ],
    currentRole: {
      type: String,
      enum: [
        'PROJECT_MANAGER',
        'CLIENT_MANAGER',
        'VICE_PRESIDENT',
        'VENDOR_ADMIN',
      ],
      default: Roles.VICE_PRESIDENT,
    },
  },
  { strict: false },
);

export default mongoose.model('workOrder', WorkOrderSchema);
