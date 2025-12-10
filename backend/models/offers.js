const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  offerCode: { type: String, required: true, unique: true, uppercase: true },
  offerName: { type: String, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minBookingAmount: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number, default: null },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  applicableFor: { type: String, enum: ['all', 'first-time', 'returning'], default: 'all' }
});

module.exports = mongoose.model('Offer', offerSchema);