// src/controllers/authController.js
// Handles user registration and login

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { isValidEmail, isStrongPassword } = require('../utils/validators');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error('Please provide a valid email address');
  }

  if (!isStrongPassword(password)) {
    res.status(400);
    throw new Error('Password must be at least 6 characters and include a number');
  }

  // Check for existing user
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  // Create user (password hashed via pre-save hook)
  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    },
  });
});

/**
 * @desc    Login user and return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    },
  });
});

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

/**
 * @desc    Update current logged-in user profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, password } = req.body;

  if (name !== undefined) {
    if (!name.trim()) {
      res.status(400);
      throw new Error('Name cannot be empty');
    }
    user.name = name.trim();
  }

  if (email !== undefined) {
    const formattedEmail = email.toLowerCase().trim();
    if (!isValidEmail(formattedEmail)) {
      res.status(400);
      throw new Error('Please provide a valid email address');
    }
    const emailExists = await User.findOne({ email: formattedEmail, _id: { $ne: user._id } });
    if (emailExists) {
      res.status(409);
      throw new Error('An account with this email already exists');
    }
    user.email = formattedEmail;
  }

  if (password) {
    if (!isStrongPassword(password)) {
      res.status(400);
      throw new Error('Password must be at least 6 characters and include a number');
    }
    user.password = password;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      token: generateToken(updatedUser._id),
    },
  });
});

module.exports = { register, login, getProfile, updateProfile };
