const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscriptionPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
    },
    plan: {
      type: String,
      enum: ['basic', 'standard', 'premium'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled', 'pending'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'upi',
    },
    upiId: {
      type: String,
    },
    paymentProof: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    paymentDate: {
      type: Date,
    },
    features: {
      type: [String],
      default: [],
    },
    selectedServices: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    }],
    bookingsLeft: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);