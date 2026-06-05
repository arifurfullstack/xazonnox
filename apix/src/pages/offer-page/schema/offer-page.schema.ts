import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { VARIATION_LIST } from '../../../schema/sub-schema.schema';

export const OfferPageSchema = new mongoose.Schema(
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
    images: {
      type: [String],
      required: false,
    },
    url: {
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
    background: {
      type: String,
      required: false,
    },
    shortDes: {
      type: String,
      required: false,
    },
    product: {
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
      costPrice: {
        type: Number,
        required: false,
      },
      salePrice: {
        type: Number,
        required: false,
      },
      regularPrice: {
        type: Number,
        required: false,
      },
      totalSold: {
        type: Number,
        required: false,
        default: 0,
      },
      discountType: {
        type: String,
        required: false,
      },
      discountAmount: {
        type: Number,
        required: false,
      },
      quantity: {
        type: Number,
        required: false,
        default: 0,
      },
      isVariation: {
        type: Boolean,
        required: false,
      },
      variation: {
        type: String,
        required: false,
      },
      variationOptions: {
        type: [],
        required: false,
      },
      variation2: {
        type: String,
        required: false,
      },
      variation2Options: {
        type: [],
        required: false,
      },
      variationList: [VARIATION_LIST],
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
