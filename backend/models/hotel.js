const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, maxlength: 100 },
  city: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  rating: { type: Number, required: true, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  image: { type: String, required: true },
  description: { type: String, required: true },
  attractions: [String],
  amenities: [String],
  roomCount: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hotel', hotelSchema);