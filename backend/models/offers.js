const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  offerCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  maxDiscountAmount: Number,
  minBookingAmount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  usedCount: {
    type: Number,
    default: 0
  },
  maxUsage: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Offer', offerSchema);

