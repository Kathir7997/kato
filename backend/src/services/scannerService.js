// src/services/scannerService.js

/**
 * A mock blocklist of known spam or malware domains.
 * In a production environment, this would be replaced with a real API call 
 * to a service like Google Safe Browsing or VirusTotal.
 */
const MOCK_BLOCKLIST = [
  'malware.com',
  'spam.net',
  'phishing-site.org',
  'free-money-scam.biz',
  'hackedsite.info'
];

/**
 * Checks if a given URL is potentially harmful or spam.
 * @param {string} url - The URL to check
 * @returns {boolean} - Returns true if harmful, false if safe
 */
const checkIfHarmful = (url) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check if the hostname or any part of it matches our blocklist
    for (const badDomain of MOCK_BLOCKLIST) {
      if (hostname === badDomain || hostname.endsWith(`.${badDomain}`)) {
        return true;
      }
    }
    
    return false;
  } catch (err) {
    // If the URL is invalid and cannot be parsed, treat it as potentially harmful
    return true;
  }
};

module.exports = {
  checkIfHarmful
};
