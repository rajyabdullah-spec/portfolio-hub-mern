const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Strict verification via HTTP-Only Cookie
const protect = async (req, res, next) => {
  const token = req.cookies && req.cookies.token;

  if (!token || token === 'none') {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const userId = decoded.id || decoded.userId;
    req.user = await User.findById(userId).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found with this token' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Authorize admin user role only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied: Admin role required' });
  }
};

module.exports = { protect, adminOnly };