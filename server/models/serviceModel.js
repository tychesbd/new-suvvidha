const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a service name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    minPrice: {
      type: Number,
      required: [true, 'Please add a minimum price'],
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
      default: 'https://source.unsplash.com/random/300x200/?service',
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

module.exports = mongoose.model('Service', serviceSchema);