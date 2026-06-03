// src/routes/user.js
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteAccount, generateApiKey } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/account', protect, deleteAccount);
router.post('/apikey', protect, generateApiKey);

module.exports = router;
