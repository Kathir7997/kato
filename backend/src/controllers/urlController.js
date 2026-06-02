// src/controllers/urlController.js
// Handles URL CRUD operations and bulk upload

const asyncHandler = require('express-async-handler');
const { parse } = require('csv-parse/sync');
const Url = require('../models/Url');
const Visit = require('../models/Visit');
const { generateShortCode } = require('../services/shortCodeService');
const { generateQRCode } = require('../services/qrService');
const { isValidUrl, isValidAlias } = require('../utils/validators');

/**
 * @desc    Create a new short URL
 * @route   POST /api/url/create
 * @access  Private
 */
const createUrl = asyncHandler(async (req, res) => {
  const { originalUrl, customAlias, expiryDate } = req.body;

  if (!originalUrl) {
    res.status(400);
    throw new Error('Original URL is required');
  }

  if (!isValidUrl(originalUrl)) {
    res.status(400);
    throw new Error('Please provide a valid URL (must start with http:// or https://)');
  }

  // Validate alias if provided
  let shortCode;
  if (customAlias) {
    if (!isValidAlias(customAlias)) {
      res.status(400);
      throw new Error('Alias must be 3-30 characters (letters, numbers, hyphens only)');
    }
    // Check alias uniqueness
    const aliasExists = await Url.findOne({ shortCode: customAlias.toLowerCase() });
    if (aliasExists) {
      res.status(409);
      throw new Error('This custom alias is already taken');
    }
    shortCode = customAlias.toLowerCase();
  } else {
    shortCode = await generateShortCode();
  }

  // Generate QR code for the short URL
  const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
  const qrCode = await generateQRCode(shortUrl);

  const url = await Url.create({
    userId: req.user._id,
    originalUrl,
    shortCode,
    customAlias: customAlias ? customAlias.toLowerCase() : null,
    qrCode,
    expiryDate: expiryDate || null,
  });

  res.status(201).json({
    success: true,
    data: { ...url.toJSON(), shortUrl },
  });
});

/**
 * @desc    Get all URLs for the logged-in user
 * @route   GET /api/url
 * @access  Private
 */
const getUrls = asyncHandler(async (req, res) => {
  const { search, status, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;

  const query = { userId: req.user._id };

  // Search filter
  if (search) {
    query.$or = [
      { originalUrl: { $regex: search, $options: 'i' } },
      { shortCode: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === 'asc' ? 1 : -1;

  const urls = await Url.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Url.countDocuments(query);

  // Add shortUrl and filter by status if needed
  const baseUrl = process.env.BASE_URL;
  let data = urls.map((u) => ({ ...u.toJSON(), shortUrl: `${baseUrl}/${u.shortCode}` }));

  if (status === 'active') {
    data = data.filter((u) => !u.isExpired);
  } else if (status === 'expired') {
    data = data.filter((u) => u.isExpired);
  }

  res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Get single URL by ID
 * @route   GET /api/url/:id
 * @access  Private
 */
const getUrlById = asyncHandler(async (req, res) => {
  const url = await Url.findOne({ _id: req.params.id, userId: req.user._id });

  if (!url) {
    res.status(404);
    throw new Error('URL not found or you do not have access');
  }

  const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;
  res.status(200).json({ success: true, data: { ...url.toJSON(), shortUrl } });
});

/**
 * @desc    Update a URL (originalUrl, alias, expiry)
 * @route   PUT /api/url/:id
 * @access  Private
 */
const updateUrl = asyncHandler(async (req, res) => {
  const url = await Url.findOne({ _id: req.params.id, userId: req.user._id });

  if (!url) {
    res.status(404);
    throw new Error('URL not found or you do not have access');
  }

  const { originalUrl, customAlias, expiryDate } = req.body;

  if (originalUrl) {
    if (!isValidUrl(originalUrl)) {
      res.status(400);
      throw new Error('Please provide a valid URL');
    }
    url.originalUrl = originalUrl;
  }

  if (customAlias !== undefined) {
    if (customAlias && !isValidAlias(customAlias)) {
      res.status(400);
      throw new Error('Alias must be 3-30 characters (letters, numbers, hyphens only)');
    }

    if (customAlias && customAlias.toLowerCase() !== url.shortCode) {
      const aliasExists = await Url.findOne({ shortCode: customAlias.toLowerCase() });
      if (aliasExists) {
        res.status(409);
        throw new Error('This custom alias is already taken');
      }
      url.shortCode = customAlias.toLowerCase();
      url.customAlias = customAlias.toLowerCase();

      // Regenerate QR code for new shortCode
      const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;
      url.qrCode = await generateQRCode(shortUrl);
    }
  }

  if (expiryDate !== undefined) {
    url.expiryDate = expiryDate || null;
  }

  const updated = await url.save();
  const shortUrl = `${process.env.BASE_URL}/${updated.shortCode}`;
  res.status(200).json({ success: true, data: { ...updated.toJSON(), shortUrl } });
});

/**
 * @desc    Delete a URL and its visit data
 * @route   DELETE /api/url/:id
 * @access  Private
 */
const deleteUrl = asyncHandler(async (req, res) => {
  const url = await Url.findOne({ _id: req.params.id, userId: req.user._id });

  if (!url) {
    res.status(404);
    throw new Error('URL not found or you do not have access');
  }

  await Visit.deleteMany({ urlId: url._id });
  await url.deleteOne();

  res.status(200).json({ success: true, message: 'URL deleted successfully' });
});

/**
 * @desc    Bulk upload URLs from CSV
 * @route   POST /api/url/bulk-upload
 * @access  Private
 */
const bulkUpload = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a CSV file');
  }

  const csvContent = req.file.buffer.toString('utf-8');
  let records;

  try {
    records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } catch {
    res.status(400);
    throw new Error('Invalid CSV format. Ensure columns: OriginalURL, CustomAlias, ExpiryDate');
  }

  const results = [];

  for (const record of records) {
    const { OriginalURL, CustomAlias, ExpiryDate } = record;

    if (!OriginalURL || !isValidUrl(OriginalURL)) {
      results.push({ originalUrl: OriginalURL, success: false, error: 'Invalid URL' });
      continue;
    }

    let shortCode;
    if (CustomAlias) {
      if (!isValidAlias(CustomAlias)) {
        results.push({ originalUrl: OriginalURL, success: false, error: 'Invalid alias format' });
        continue;
      }
      const exists = await Url.findOne({ shortCode: CustomAlias.toLowerCase() });
      if (exists) {
        results.push({ originalUrl: OriginalURL, success: false, error: 'Alias already taken' });
        continue;
      }
      shortCode = CustomAlias.toLowerCase();
    } else {
      shortCode = await generateShortCode();
    }

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    const qrCode = await generateQRCode(shortUrl);

    try {
      const url = await Url.create({
        userId: req.user._id,
        originalUrl: OriginalURL,
        shortCode,
        customAlias: CustomAlias ? CustomAlias.toLowerCase() : null,
        qrCode,
        expiryDate: ExpiryDate || null,
      });
      results.push({ originalUrl: OriginalURL, shortUrl, shortCode, success: true, id: url._id });
    } catch (err) {
      results.push({ originalUrl: OriginalURL, success: false, error: err.message });
    }
  }

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.length - successCount;

  res.status(200).json({
    success: true,
    message: `Processed ${records.length} rows: ${successCount} created, ${failCount} failed`,
    data: results,
  });
});

module.exports = { createUrl, getUrls, getUrlById, updateUrl, deleteUrl, bulkUpload };
