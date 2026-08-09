const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} = require('../controllers/messageController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Public route for portfolio visitors
router.post('/', sendMessage);

// Protected Admin routes
router.get('/', protect, adminOnly, getMessages);
router.put('/:id/read', protect, adminOnly, markAsRead);
router.delete('/:id', protect, adminOnly, deleteMessage);

module.exports = router;