import * as mongoose from 'mongoose';
import { Schema, Types } from 'mongoose';

export const AffiliateConnectionSchema = new mongoose.Schema(
  {
    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Affiliate',
      required: false,
    },

    ownerId: {
      type: Types.ObjectId,
      required: false,
    }, // Shop or Admin ID
    ownerType: {
      type: String,
      enum: ['shop', 'admin'],
      required: false,
    },

    status: {
      type: String,
      enum: ['approved', 'blocked', 'pending'],
      required: false,
      default: 'pending',
    },
    note: {
      type: String,
      required: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    paymentType: {
      type: String,
      enum: ['bkash', 'nagad', 'bank', 'card', 'rocket', 'ssl'],
    },
    accountInfo: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
