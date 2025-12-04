const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: String,
  location: String,
  price: { type: Number, required: true }, // per night
  rating: Number,
  reviews: Number,
  image: String,
  amenities: [String],
  attractions: [String],
});

module.exports = mongoose.model('Hotel', hotelSchema);
