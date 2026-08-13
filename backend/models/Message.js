const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: [true, 'Please add your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add your email'],
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      default: 'No Subject',
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please enter a message'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);