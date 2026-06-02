// src/services/qrService.js
// Generates QR code as a base64 PNG data URI

const QRCode = require('qrcode');

/**
 * Generate a QR code for the given URL and return it as a base64 data URI.
 * @param {string} url - The full short URL to encode
 * @returns {Promise<string>} - data:image/png;base64,...
 */
const generateQRCode = async (url) => {
  try {
    const qrDataURL = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1e1b4b',  // indigo-950
        light: '#ffffff',
      },
    });
    return qrDataURL;
  } catch (error) {
    console.error('QR generation error:', error.message);
    return null;
  }
};

module.exports = { generateQRCode };
