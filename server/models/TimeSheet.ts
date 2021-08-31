import mongoose from 'mongoose';
import ProjectSchema from './Project';
import EmployeeSchema from './Employees';
import Profile from './Profile';
import VendorSchema from './Vendor';
import ClientSchema from './Client';

export enum Status {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  POSTED = 'POSTED',
}

const TimeSheetSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.ObjectId,
      ref: EmployeeSchema.modelName,
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.ObjectId,
      ref: VendorSchema.modelName,
      required: true,
    },
    clientId: {
      type: mongoose.Schema.ObjectId,
      ref: ClientSchema.modelName,
      required: true,
    },
    data: [
      {
        // human readble id empId-week-yaer-ver
        id: String,
        tasks: [
          {
            taskName: {
              type: String,
            },
            weekData: {
              Sun: {
                day: String,
                date: Date,
                hrs: {
                  type: Number,
                  min: 0,
                  max: 24,
                  default: 0,
                },
                active: Number,
                comments: String,
              },
              Mon: {
                day: String,
                date: Date,
                hrs: {
                  type: Number,
                  min: 0,
                  max: 24,
                  default: 0,
                },
                active: Number,
                comments: String,
              },
              Tue: {
                day: String,
                date: Date,
                hrs: {
                  type: Number,
                  min: 0,
                  max: 24,
                  default: 0,
                },
                active: Number,
                comments: String,
              },
              Wed: {
                day: String,
                date: Date,
                hrs: {
                  type: Number,
                  min: 0,
                  max: 24,
                  default: 0,
                },
                active: Number,
                comments: String,
              },
              Thu: {
                day: String,
                date: Date,
                hrs: {
                  type: Number,
                  min: 0,
                  max: 24,
                  default: 0,
                },
                active: Number,
                comments: String,
              },
              Fri: {
                day: String,
                date: Date,
                hrs: {
                  type: Number,
                  min: 0,
                  max: 24,
                  default: 0,
                },
                active: Number,
                comments: String,
              },
              Sat: {
                day: String,
                date: Date,
                hrs: {
                  type: Number,
                  min: 0,
                  max: 24,
                  default: 0,
                },
                active: Number,
                comments: String,
              },
            },
          },
        ],
        suggestion: {
          type: String,
          default: '',
        },
        status: {
          type: String,
          enum: ['APPROVED', 'SUBMITTED', 'REJECTED', 'POSTED'],
          default: 'SUBMITTED',
        },
        updatedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    lastApproved: Date,
    startDate: Date,
    endDate: Date,
    weekNumber: Number,
    year: String,
    profileId: {
      type: mongoose.Schema.ObjectId,
      ref: Profile.modelName,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.ObjectId,
      ref: ProjectSchema.modelName,
      required: true,
    },
  },
  { strict: false },
);

export default mongoose.model('Timesheets', TimeSheetSchema);
