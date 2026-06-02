// src/utils/validators.js
// Shared validation helpers

/**
 * Check if a string is a valid URL
 * @param {string} url
 * @returns {boolean}
 */
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Check if an alias contains only safe characters (alphanumeric + hyphens)
 * @param {string} alias
 * @returns {boolean}
 */
const isValidAlias = (alias) => {
  return /^[a-zA-Z0-9-_]{3,30}$/.test(alias);
};

/**
 * Check if an email is valid format
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

/**
 * Check if password is strong (min 6 chars, at least 1 number)
 * @param {string} password
 * @returns {boolean}
 */
const isStrongPassword = (password) => {
  return password.length >= 6 && /\d/.test(password);
};

module.exports = { isValidUrl, isValidAlias, isValidEmail, isStrongPassword };
