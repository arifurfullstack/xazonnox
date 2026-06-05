import * as mongoose from 'mongoose';

export const AffiliateReportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['earning', 'withdrawal'],
      required: true,
      default: 'earning',
    },
    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Affiliate',
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    }, // shop/admin ID
    ownerType: {
      type: String,
      enum: ['shop', 'admin'],
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AffiliateProduct',
      required: false,
    },

    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      required: false,
    }, // bkash/nagad/bank/etc
    note: {
      type: String,
      required: false,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: false,
    },

    status: {
      type: String,
      enum: ['pending', 'paid', 'requested'],
      default: 'pending',
    }, // 'pending' = from sale, 'requested' = payout request, 'paid' = completed

    // Extra fields for reporting view
    // refferId: { type: String, required: true }, // alias for affiliate._id (as string)
    image: { type: String, required: false }, // same as method
    dateString: { type: String, required: false }, // formatted createdAt date: YYYY-MM-DD

    linkedWithdrawalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AffiliateReport', // withdrawal-type
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
