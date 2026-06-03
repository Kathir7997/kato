// src/routes/url.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middlewares/authMiddleware');
const {
  createUrl,
  getUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
  bulkUpload,
  exportUrls,
} = require('../controllers/urlController');

// Use memory storage for CSV files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
});

router.use(protect); // all URL routes require auth

router.post('/create', createUrl);
router.post('/bulk-upload', upload.single('file'), bulkUpload);
router.get('/export', exportUrls);
router.get('/', getUrls);
router.get('/:id', getUrlById);
router.put('/:id', updateUrl);
router.delete('/:id', deleteUrl);

module.exports = router;
