const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markAsRead,
  toggleStarMessage,
  deleteMessage,
  bulkDeleteMessages,
  bulkMarkReadMessages,
} = require('../controllers/messageController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Public route for portfolio visitors
router.post('/', sendMessage);

// Protected Admin routes (Bulk actions must be before /:id routes)
router.post('/bulk-delete', protect, adminOnly, bulkDeleteMessages);
router.post('/bulk-read', protect, adminOnly, bulkMarkReadMessages);

router.get('/', protect, adminOnly, getMessages);
router.put('/:id/read', protect, adminOnly, markAsRead);
router.put('/:id/star', protect, adminOnly, toggleStarMessage);
router.delete('/:id', protect, adminOnly, deleteMessage);

module.exports = router;