import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const AffiliateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: false,
    },
    phoneNo: {
      type: String,
      required: false,
    },
    fullPhoneNo: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: false,
   },
    isPasswordLess: {
      type: Boolean,
      required: true,
    },
    hasAccess: {
      type: Boolean,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    registrationType: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: false,
    },
    experience: {
      type: String,
      required: false,
    },
    profileBanner: {
      type: String,
      required: false,
    },

    gender: {
      type: String,
      required: false,
    },
    shop: {
      type: String,
      required: false,
    },
    profileImg: {
      type: String,
      required: false,
    },
    nidImg: {
      type: String,
      required: false,
    },
    nidBackImg: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },

    registrationAt: {
      type: String,
      required: false,
    },
    lastLoggedIn: {
      type: Date,
      required: false,
    },

    failedLoginCount: {
      type: Number,
      required: false,
    },

    totalEarning: {
      type: Number,
      required: false,
    },
    totalRefers: {
      type: Number,
      required: false,
    },
    paidAmount: {
      type: Number,
      required: false,
    },
    dueAmount: {
      type: Number,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
    // new field add for Affiliate
    // approvedByAdmin: { type: Boolean, default: false },
    addedBy: { type: String, enum: ['self', 'shop', 'admin'], default: 'self' },

    // // Requests sent by affiliator
    // shopRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],
    // adminRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }],
    //
    // // Approved marketing access
    // approvedShops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],
    // approvedAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }],

    // Payment Info per shop/admin
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
