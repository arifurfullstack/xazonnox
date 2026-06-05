import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { VARIATION_LIST } from '../../../schema/sub-schema.schema';

export const FixedLandingPageSchema = new mongoose.Schema(
  {
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    offerTitle: {
      type: String,
      required: false,
    },
    specificationImage: {
      type: [String],
      required: false,
    },
    specifications: {
      type: [Object],
      required: false,
    },
    whyBest: {
      type: [Object],
      required: false,
    },
    reviewTitle: {
      type: String,
      required: false,
    },
    reviewScreenShoot: {
      type: [String],
      required: false,
    },
    reviews: {
      type: [Object],
      required: false,
    },
    offerText: {
      type: String,
      required: false,
    },
    faqList: {
      type: [Object],
      required: false,
    },
    faqTitle: {
      type: String,
      required: false,
    },
    paymentTitle: {
      type: String,
      required: false,
    },
    whyBestTitle: {
      type: String,
      required: false,
    },
    whyBestDescription: {
      type: String,
      required: false,
    },
    whyBestImage: {
      type: String,
      required: false,
    },
    whyBuy: {
      type: String,
      required: false,
    },
    backgroundColor: {
      type: String,
      required: false,
    },
    textColor: {
      type: String,
      required: false,
    },
    whyBuyDescription: {
      type: String,
      required: false,
    },
    certificateImage: {
      type: String,
      required: false,
    },
    videoUrl: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      required: false,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    productInfo: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      slug: {
        type: String,
        required: false,
      },
      images: {
        type: [String],
        required: false,
      },
      category: {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'Category',
          required: false,
        },
        name: {
          type: String,
          required: false,
        },
        slug: {
          type: String,
          required: false,
        },
      },
    },
    priority: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
    deleteDateString: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
