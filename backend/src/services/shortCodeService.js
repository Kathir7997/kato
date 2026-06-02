// src/services/shortCodeService.js
// Generates unique short codes using nanoid

const { nanoid } = require('nanoid');
const Url = require('../models/Url');

/**
 * Generate a unique 6-character alphanumeric short code.
 * Retries if collision detected (extremely rare).
 */
const generateShortCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = nanoid(6); // e.g., "aB3kZ9"
    exists = await Url.findOne({ shortCode: code });
  }

  return code;
};

module.exports = { generateShortCode };
