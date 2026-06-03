// src/controllers/publicController.js
// Public redirect and public stats (no auth required)

const asyncHandler = require('express-async-handler');
const Url = require('../models/Url');
const Visit = require('../models/Visit');
const { parseVisitorData } = require('../services/geoService');

/**
 * @desc    Redirect short URL to original URL and log visit
 * @route   GET /:shortCode
 * @access  Public
 */
const redirectUrl = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;

  const url = await Url.findOne({ shortCode });

  if (!url) {
    return res.status(404).json({ success: false, message: 'Short URL not found' });
  }

  // Check expiry
  if (url.expiryDate && new Date() > new Date(url.expiryDate)) {
    return res.status(410).json({
      success: false,
      message: 'Link Expired',
      expiredAt: url.expiryDate,
    });
  }

  let visitId = null;
  try {
    const visitorData = await parseVisitorData(req);

    // Check if a visit with the same IP already exists for this URL
    const ipExists = await Visit.exists({ urlId: url._id, ip: visitorData.ip });

    if (!ipExists) {
      await Url.findByIdAndUpdate(url._id, { $inc: { clickCount: 1, uniqueClickCount: 1 } });
    } else {
      await Url.findByIdAndUpdate(url._id, { $inc: { clickCount: 1 } });
    }

    const visit = await Visit.create({ urlId: url._id, ...visitorData });
    visitId = visit._id;
  } catch (err) {
    console.error('Visit logging error:', err.message);
    // Fallback increment clickCount
    await Url.findByIdAndUpdate(url._id, { $inc: { clickCount: 1 } });
  }

  // Return HTML intermediate page prompting for location permission
  return res.send(`<!DOCTYPE html>
    <html>
      <head>
        <title>Redirecting...</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            overflow: hidden;
          }
          .card {
            text-align: center;
            padding: 2.5rem;
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(20px);
            max-width: 400px;
            width: 90%;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(99, 102, 241, 0.1);
            border-top: 4px solid #6366f1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1.5rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          h1 {
            font-size: 1.5rem;
            margin: 0 0 0.5rem;
            font-weight: 800;
            letter-spacing: -0.025em;
          }
          p {
            color: #94a3b8;
            font-size: 0.875rem;
            margin: 0;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="spinner"></div>
          <h1>Redirecting you</h1>
          <p id="status-text">Requesting location permission...</p>
        </div>
        <script>
          const originalUrl = ${JSON.stringify(url.originalUrl)};
          const visitId = ${JSON.stringify(visitId)};

          let redirected = false;
          function doRedirect() {
            if (redirected) return;
            redirected = true;
            window.location.replace(originalUrl);
          }

          // Force redirect after 10 seconds fallback safety net to allow time for location prompt
          setTimeout(doRedirect, 10000);

          if (navigator.geolocation && visitId) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                if (redirected) return;
                try {
                  const lat = position.coords.latitude;
                  const lon = position.coords.longitude;
                  
                  // Await the fetch call to ensure it reaches the backend before page unloads
                  const geoData = await fetch('/api/public/log-location', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      visitId: visitId,
                      latitude: lat,
                      longitude: lon
                    })
                  }).then(r => r.json());
                } catch (e) {
                  console.warn('Log location failed:', e);
                } finally {
                  // Small delay to ensure DB save completes before navigation aborts connection
                  setTimeout(doRedirect, 200);
                }
              },
              (error) => {
                console.warn('Geolocation permission error:', error.message);
                doRedirect();
              },
              { timeout: 5000, maximumAge: 0 }
            );
          } else {
            doRedirect();
          }
        </script>
      </body>
    </html>
  `);
});

/**
 * @desc    Get public stats for a short URL (no auth)
 * @route   GET /api/public/stats/:shortCode
 * @access  Public
 */
const getPublicStats = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;

  const url = await Url.findOne({ shortCode }).select('-userId');

  if (!url) {
    res.status(404);
    throw new Error('Short URL not found');
  }

  const lastVisit = await Visit.findOne({ urlId: url._id })
    .sort({ timestamp: -1 })
    .select('timestamp');

  const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;

  res.status(200).json({
    success: true,
    data: {
      shortUrl,
      shortCode: url.shortCode,
      clickCount: url.clickCount,
      uniqueClickCount: url.uniqueClickCount || 0,
      createdAt: url.createdAt,
      expiryDate: url.expiryDate,
      isExpired: url.isExpired,
      lastVisit: lastVisit?.timestamp || null,
      qrCode: url.qrCode,
    },
  });
});

/**
 * @desc    Log resolved client location details for a visit
 * @route   POST /api/public/log-location
 * @access  Public
 */
const logLocation = asyncHandler(async (req, res) => {
  const { visitId, latitude, longitude } = req.body;

  if (!visitId) {
    res.status(400);
    throw new Error('Visit ID is required');
  }

  const visit = await Visit.findById(visitId);
  if (!visit) {
    res.status(404);
    throw new Error('Visit not found');
  }

  if (latitude !== undefined && longitude !== undefined) {
    visit.latitude = latitude;
    visit.longitude = longitude;
    try {
      const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      const geoData = await geoRes.json();
      if (geoData) {
        if (geoData.countryName) visit.country = geoData.countryName;
        visit.city = geoData.city || geoData.locality || geoData.principalSubdivision || visit.city;
      }
    } catch (err) {
      console.error('Server-side reverse geocoding error:', err.message);
    }
  }

  await visit.save();

  res.status(200).json({ success: true, message: 'Location updated successfully' });
});

module.exports = { redirectUrl, getPublicStats, logLocation };
