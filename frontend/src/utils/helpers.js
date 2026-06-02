// src/utils/helpers.js
// Shared utility functions

/**
 * Truncate a string to a max length and append ellipsis
 */
export const truncate = (str, max = 50) => {
  if (!str) return '';
  return str.length > max ? str.substring(0, max) + '...' : str;
};

/**
 * Format a date string to human-readable format
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date to relative time (e.g., "2 days ago")
 */
export const timeAgo = (dateString) => {
  if (!dateString) return '—';
  const diff = Date.now() - new Date(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
};

/**
 * Copy text to clipboard and return success boolean
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Download a base64 data URI as a PNG file
 */
export const downloadDataURI = (dataURI, filename = 'qr-code.png') => {
  const link = document.createElement('a');
  link.href = dataURI;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Check if a URL string is expired
 */
export const isExpired = (expiryDate) => {
  if (!expiryDate) return false;
  return new Date() > new Date(expiryDate);
};

/**
 * Generate a random gradient color pair for chart slices
 */
export const CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
  '#14b8a6', '#f59e0b', '#ef4444', '#3b82f6',
  '#10b981', '#f97316',
];
