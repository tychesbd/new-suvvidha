const asyncHandler = require('express-async-handler');
const Service = require('../models/serviceModel');

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
const createService = asyncHandler(async (req, res) => {
  const { name, description, category, minPrice } = req.body;

  if (!name || !description || !category || !minPrice) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if service with same name already exists
  const serviceExists = await Service.findOne({ name });

  if (serviceExists) {
    res.status(400);
    throw new Error('Service with this name already exists');
  }

  // Set image path if file was uploaded
  let imagePath = `https://source.unsplash.com/random/300x200/?${category.toLowerCase()}`;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  // Create service
  const service = await Service.create({
    name,
    description,
    category,
    minPrice,
    image: imagePath,
  })

  if (service) {
    res.status(201).json(service);
  } else {
    res.status(400);
    throw new Error('Invalid service data');
  }
});

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({});
  res.json(services);
});

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (service) {
    res.json(service);
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = asyncHandler(async (req, res) => {
  const { name, description, category, minPrice, isActive } = req.body;

  const service = await Service.findById(req.params.id);

  if (service) {
    // If name is being changed, check if new name already exists
    if (name && name !== service.name) {
      const serviceWithName = await Service.findOne({ name });
      if (serviceWithName) {
        res.status(400);
        throw new Error('Service with this name already exists');
      }
    }
    
    // Set image path if file was uploaded
    if (req.file) {
      service.image = `/uploads/${req.file.filename}`;
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.category = category || service.category;
    service.minPrice = minPrice !== undefined ? minPrice : service.minPrice;
    service.isActive = isActive !== undefined ? isActive : service.isActive;

    const updatedService = await service.save();
    res.json(updatedService);
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (service) {
    await service.deleteOne();
    res.json({ message: 'Service removed' });
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
});

// @desc    Get services by category
// @route   GET /api/services/category/:category
// @access  Public
const getServicesByCategory = asyncHandler(async (req, res) => {
  const services = await Service.find({ category: req.params.category });
  res.json(services);
});

// @desc    Search services
// @route   GET /api/services/search/:keyword
// @access  Public
const searchServices = asyncHandler(async (req, res) => {
  const keyword = req.params.keyword;
  
  if (!keyword) {
    return res.status(400).json({ message: 'Please provide a search keyword' });
  }
  
  const services = await Service.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } }
    ]
  });
  
  res.json(services);
});

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByCategory,
  searchServices,
};