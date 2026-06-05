import * as mongoose from 'mongoose';
import { Schema, Types } from 'mongoose';

export const AffiliateProductSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: false,

    },
    image: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
    // productId: { type: Types.ObjectId, required: true, ref: 'Product' },
    ownerId: { type: Types.ObjectId, required: false }, // Shop or Admin ID
    ownerType: { type: String, enum: ['shop', 'admin'], required: false },

    description: {
      type: String,
      required: false,
    },

    url: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Required when using unique with optional fields

    },
    price: {
      type: Number,
      required: false,
      default: 0,
    },
    regularPrice: {
      type: Number,
      required: false,
      default: 0,
    },
    discountAmount: {
      type: Number,
      required: false,
      default: 0,
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
