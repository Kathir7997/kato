// src/models/Visit.js
// Mongoose schema for tracking each click on a short URL

const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Url',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    device: {
      type: String,
      default: 'Unknown',
    },
    os: {
      type: String,
      default: 'Unknown',
    },
    ip: {
      type: String,
      default: '0.0.0.0',
    },
    country: {
      type: String,
      default: 'Unknown',
    },
    city: {
      type: String,
      default: 'Unknown',
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model('Visit', visitSchema);
