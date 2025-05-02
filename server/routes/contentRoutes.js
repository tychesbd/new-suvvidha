const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const {
  createOrUpdateContent,
  getAllContent,
  getContentByType,
} = require('../controllers/contentController');

// Public routes
router.get('/', getAllContent);
router.get('/:type', getContentByType);

// Admin routes
router.post('/', protect, admin, uploadMiddleware.single('image'), createOrUpdateContent);

module.exports = router;