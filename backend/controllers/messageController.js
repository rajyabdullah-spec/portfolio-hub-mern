const Message = require('../models/Message');

// @desc    Send a new contact message
// @route   POST /api/messages
// @access  Public
const sendMessage = async (req, res) => {
  try {
    const { senderName, email, subject, message } = req.body;

    if (!senderName || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message content' });
    }

    const newMessage = await Message.create({
      senderName,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle Star/Favorite status
// @route   PUT /api/messages/:id/star
// @access  Private/Admin
const toggleStarMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.isStarred = !message.isStarred;
    await message.save();

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk Delete messages
// @route   POST /api/messages/bulk-delete
// @access  Private/Admin
const bulkDeleteMessages = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No message IDs provided' });
    }

    await Message.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: 'Selected messages deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk Mark as Read
// @route   POST /api/messages/bulk-read
// @access  Private/Admin
const bulkMarkReadMessages = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No message IDs provided' });
    }

    await Message.updateMany(
      { _id: { $in: ids } },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: 'Selected messages marked as read',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  toggleStarMessage,
  deleteMessage,
  bulkDeleteMessages,
  bulkMarkReadMessages,
};