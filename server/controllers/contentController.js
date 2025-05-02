const asyncHandler = require('express-async-handler');
const Content = require('../models/contentModel');

// @desc    Create or update content
// @route   POST /api/content
// @access  Private/Admin
const createOrUpdateContent = asyncHandler(async (req, res) => {
  const { type, title, subtitle, description, buttonText, buttonLink } = req.body;

  if (!type || !title) {
    res.status(400);
    throw new Error('Please provide content type and title');
  }

  // Set image path if file was uploaded
  let imagePath = req.body.image || `https://source.unsplash.com/random/1200x600/?${type}`;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  // Check if content of this type already exists
  const existingContent = await Content.findOne({ type });

  let content;
  
  if (existingContent) {
    // Update existing content
    existingContent.title = title;
    existingContent.subtitle = subtitle || existingContent.subtitle;
    existingContent.description = description || existingContent.description;
    existingContent.buttonText = buttonText || existingContent.buttonText;
    existingContent.buttonLink = buttonLink || existingContent.buttonLink;
    existingContent.image = imagePath;
    
    content = await existingContent.save();
    res.json(content);
  } else {
    // Create new content
    content = await Content.create({
      type,
      title,
      subtitle,
      description,
      buttonText,
      buttonLink,
      image: imagePath,
    });

    if (content) {
      res.status(201).json(content);
    } else {
      res.status(400);
      throw new Error('Invalid content data');
    }
  }
});

// @desc    Get all content
// @route   GET /api/content
// @access  Public
const getAllContent = asyncHandler(async (req, res) => {
  const content = await Content.find({});
  res.json(content);
});

// @desc    Get content by type
// @route   GET /api/content/:type
// @access  Public
const getContentByType = asyncHandler(async (req, res) => {
  const content = await Content.findOne({ type: req.params.type });
  
  if (content) {
    res.json(content);
  } else {
    res.status(404);
    throw new Error('Content not found');
  }
});

module.exports = {
  createOrUpdateContent,
  getAllContent,
  getContentByType,
};