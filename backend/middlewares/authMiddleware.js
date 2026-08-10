const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify JWT Token from Cookies or Bearer Header
const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in HTTP-Only Cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback check for Authorization Bearer Header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === 'none') {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    // Verify token payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Support both decoded.id and decoded.userId
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