import * as mongoose from 'mongoose';

export const DivisionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
      default: 'publish',
    },
    deleteDateString: {
      type: String,
      required: false,
    },
    priority: {
      type: Number,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
