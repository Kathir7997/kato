// src/middlewares/authMiddleware.js
// JWT authentication middleware — protects private routes

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * Protect middleware: validates JWT and attaches user to req.user
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  const apiKey = req.headers['x-api-key'];
  if (apiKey) {
    const user = await User.findOne({ apiKey });
    if (user) {
      req.user = user;
      return next();
    }
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized — user no longer exists');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized — invalid or expired token');
  }
});

module.exports = { protect };
