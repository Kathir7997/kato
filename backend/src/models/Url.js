// src/models/Url.js
// Mongoose schema for shortened URLs

const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customAlias: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    qrCode: {
      type: String, // base64 data URI
      default: null,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    uniqueClickCount: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Virtual: isExpired
urlSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > new Date(this.expiryDate);
});

// Ensure virtuals are included in JSON output
urlSchema.set('toJSON', { virtuals: true });
urlSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Url', urlSchema);
