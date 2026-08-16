const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a project title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    techStack: {
      type: [String],
      required: [true, 'Please add at least one technology'],
    },
    liveUrl: {
      type: String,
      default: '',
      trim: true,
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    subPathUrl: {
      type: String,
      default: '',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);