const express = require('express');
const router = express.Router();
const {
  getProjects,
  getAdminProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Public route for visitors (Returns only published projects)
router.get('/', getProjects);

// Protected Admin route for dashboard (Returns all projects)
// Note: Must be placed before '/:id' to prevent route parameter conflicts
router.get('/admin', protect, adminOnly, getAdminProjects);

// Public route for single project details
router.get('/:id', getProjectById);

// Protected Admin routes for CRUD operations
router.post('/', protect, adminOnly, createProject);
router.put('/:id', protect, adminOnly, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

module.exports = router;