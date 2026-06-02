// src/routes/public.js
const express = require('express');
const router = express.Router();
const { getPublicStats, logLocation } = require('../controllers/publicController');

// Public stats — no auth required
router.get('/stats/:shortCode', getPublicStats);
router.post('/log-location', logLocation);

module.exports = router;
