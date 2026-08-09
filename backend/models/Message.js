const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: [true, 'Please add your name'],
    },
    email: {
      type: String,
      required: [true, 'Please add your email'],
    },
    subject: {
      type: String,
      default: 'No Subject',
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