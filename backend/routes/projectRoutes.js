const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Public Backend Proxy for GitHub README fetching (Uses native Node fetch API)
router.get('/readme-proxy', async (req, res) => {
  try {
    const { repoUrl } = req.query;
    if (!repoUrl) {
      return res.status(400).json({ success: false, message: 'repoUrl query parameter is required.' });
    }

    const cleanPath = repoUrl.replace('https://github.com/', '').replace(/\/$/, '');
    const [owner, repo] = cleanPath.split('/');

    if (!owner || !repo) {
      return res.status(400).json({ success: false, message: 'Invalid repository path structure.' });
    }

    // Attempt 1: GitHub Official REST API
    try {
      const apiRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: { Accept: 'application/vnd.github.v3.raw', 'User-Agent': 'PortfolioHubApp' },
      });
      if (apiRes.ok) {
        const textData = await apiRes.text();
        return res.send(textData);
      }
    } catch (apiErr) {
      // Fallback to raw content if API fails
    }

    // Attempt 2: Raw GitHub URL (main branch)
    try {
      const mainRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`);
      if (mainRes.ok) {
        const textData = await mainRes.text();
        return res.send(textData);
      }
    } catch (mainErr) {
      // Fallback to master branch
    }

    // Attempt 3: Raw GitHub URL (master branch)
    const masterRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`);
    if (masterRes.ok) {
      const textData = await masterRes.text();
      return res.send(textData);
    }

    return res.status(404).json({ success: false, message: 'README.md file not found in this repository.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing README request.' });
  }
});

// Public routes
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Protected Admin routes
router.post('/', protect, adminOnly, createProject);
router.put('/:id', protect, adminOnly, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

module.exports = router;