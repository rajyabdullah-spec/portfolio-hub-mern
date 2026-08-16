const Project = require('../models/Project');

// @desc    Fetch all published projects (For Public Portfolio)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { isPublished: true },
        { isPublished: { $exists: false } }
      ]
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch all projects including drafts (For Admin Dashboard)
// @route   GET /api/projects/admin
// @access  Private/Admin
const getAdminProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    const { title, description, techStack, liveUrl, githubUrl, subPathUrl, imageUrl, featured, isPublished } = req.body;

    const project = await Project.create({
      title,
      description,
      techStack,
      liveUrl,
      githubUrl,
      subPathUrl,
      imageUrl,
      featured,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { title, description, techStack, liveUrl, githubUrl, subPathUrl, imageUrl, featured, isPublished } = req.body;

    project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        techStack,
        liveUrl,
        githubUrl,
        subPathUrl,
        imageUrl,
        featured,
        isPublished,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjects,
  getAdminProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};