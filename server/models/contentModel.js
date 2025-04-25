const mongoose = require('mongoose');

const contentSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['hero', 'whyUs', 'ads'],
      default: 'hero'
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    buttonText: {
      type: String,
      trim: true,
    },
    buttonLink: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: 'https://source.unsplash.com/random/1200x600/?service',
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

module.exports = mongoose.model('Content', contentSchema);