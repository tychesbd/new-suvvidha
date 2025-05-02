const mongoose = require('mongoose');

const subscriptionPlanSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a plan name'],
      unique: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: 0,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    bookingLimit: {
      type: Number,
      required: [true, 'Please add a booking limit'],
      min: 1,
    },
    validityPeriod: {
      type: Number,
      required: [true, 'Please add a validity period in days'],
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);