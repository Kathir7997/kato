// src/utils/generateToken.js
// JWT token generator

const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for a user ID
 * @param {string} id - MongoDB User _id
 * @returns {string} signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = generateToken;
