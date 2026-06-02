// src/controllers/analyticsController.js
// Returns aggregated analytics data for a URL

const asyncHandler = require('express-async-handler');
const Url = require('../models/Url');
const Visit = require('../models/Visit');

/**
 * @desc    Get full analytics for a URL
 * @route   GET /api/analytics/:id
 * @access  Private
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const url = await Url.findOne({ _id: req.params.id, userId: req.user._id });

  if (!url) {
    res.status(404);
    throw new Error('URL not found or you do not have access');
  }

  const visits = await Visit.find({ urlId: url._id }).sort({ timestamp: -1 });

  // --- Summary Stats ---
  const totalClicks = visits.length;
  const uniqueIps = new Set(visits.map((v) => v.ip)).size;
  const lastVisit = visits.length > 0 ? visits[0].timestamp : null;

  // Average clicks per day
  const firstVisit = visits.length > 0 ? visits[visits.length - 1].timestamp : null;
  let avgClicksPerDay = 0;
  if (firstVisit && lastVisit) {
    const daysDiff = Math.max(
      1,
      Math.ceil((new Date(lastVisit) - new Date(firstVisit)) / (1000 * 60 * 60 * 24))
    );
    avgClicksPerDay = (totalClicks / daysDiff).toFixed(2);
  }

  // --- Daily Click Trend (last 30 days) ---
  const dailyMap = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    dailyMap[key] = 0;
  }

  visits.forEach((v) => {
    const key = new Date(v.timestamp).toISOString().split('T')[0];
    if (dailyMap[key] !== undefined) {
      dailyMap[key]++;
    }
  });

  const dailyTrend = Object.entries(dailyMap).map(([date, clicks]) => ({ date, clicks }));

  // --- Device Distribution ---
  const deviceMap = {};
  visits.forEach((v) => {
    deviceMap[v.device] = (deviceMap[v.device] || 0) + 1;
  });
  const deviceData = Object.entries(deviceMap).map(([name, value]) => ({ name, value }));

  // --- Browser Distribution ---
  const browserMap = {};
  visits.forEach((v) => {
    browserMap[v.browser] = (browserMap[v.browser] || 0) + 1;
  });
  const browserData = Object.entries(browserMap).map(([name, value]) => ({ name, value }));

  // --- Country Distribution ---
  const countryMap = {};
  visits.forEach((v) => {
    countryMap[v.country] = (countryMap[v.country] || 0) + 1;
  });
  const countryData = Object.entries(countryMap)
    .map(([country, clicks]) => ({ country, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  // --- Recent Visits (last 50) ---
  const recentVisits = visits.slice(0, 50).map((v) => ({
    _id: v._id,
    date: new Date(v.timestamp).toLocaleDateString(),
    time: new Date(v.timestamp).toLocaleTimeString(),
    browser: v.browser,
    device: v.device,
    os: v.os,
    country: v.country,
    city: v.city,
  }));

  const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;

  res.status(200).json({
    success: true,
    data: {
      url: { ...url.toJSON(), shortUrl },
      summary: { totalClicks, uniqueVisitors: uniqueIps, lastVisit, avgClicksPerDay },
      dailyTrend,
      deviceData,
      browserData,
      countryData,
      recentVisits,
    },
  });
});

module.exports = { getAnalytics };
