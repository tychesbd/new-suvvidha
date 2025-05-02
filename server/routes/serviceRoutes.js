const express = require('express');
const router = express.Router();
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByCategory,
  searchServices,
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getServices);
router.get('/search/:keyword', searchServices);
router.get('/category/:category', getServicesByCategory);
router.get('/:id', getServiceById);

// Admin routes
router.post('/', protect, admin, upload.single('image'), createService);
router.put('/:id', protect, admin, upload.single('image'), updateService);
router.delete('/:id', protect, admin, deleteService);

module.exports = router;