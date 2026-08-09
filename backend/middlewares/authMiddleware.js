const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify JWT Token from Cookies
const protect = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      // Verify token payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Authorize admin user role only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin role required' });
  }
};

module.exports = { protect, adminOnly };