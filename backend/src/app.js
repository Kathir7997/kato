// src/app.js
// Express application setup

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const { redirectUrl } = require('./controllers/publicController');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const urlRoutes = require('./routes/url');
const analyticsRoutes = require('./routes/analytics');
const publicRoutes = require('./routes/public');

const app = express();

// ─── Security & Logging ────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─── Body Parsers ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/public', publicRoutes);

// ─── Short URL Redirect (must come after API routes) ──────────────────────
app.get('/:shortCode', redirectUrl);

// ─── Error Handling ────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
