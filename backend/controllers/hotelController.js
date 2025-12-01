const Hotel = require('../models/hotel');

exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getHotelsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const hotels = await Hotel.find({ city: new RegExp(city, 'i') });
    res.status(200).json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, error: 'Hotel not found' });
    }
    res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.filterHotels = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, minRating, sortBy } = req.body;
    let filter = {};
    
    if (city) filter.city = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }
    if (minRating) filter.rating = { $gte: minRating };
    
    let query = Hotel.find(filter);
    
    if (sortBy === 'price-low') query = query.sort({ price: 1 });
    if (sortBy === 'price-high') query = query.sort({ price: -1 });
    if (sortBy === 'rating') query = query.sort({ rating: -1 });
    
    const hotels = await query;
    res.status(200).json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.searchHotels = async (req, res) => {
  try {
    const { query } = req.query;
    const hotels = await Hotel.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { city: new RegExp(query, 'i') },
        { location: new RegExp(query, 'i') }
      ]
    });
    res.status(200).json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getNearbyAttractions = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, error: 'Hotel not found' });
    }
    res.status(200).json({ success: true, attractions: hotel.attractions || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};