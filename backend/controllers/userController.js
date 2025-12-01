const User = require('../models/user');
const Favorite = require('../models/Favorite');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, error: 'User already exists' });

    user = new User({ firstName, lastName, email, password, phone });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.status(201).json({ success: true, token, user: { id: user._id, firstName, lastName, email } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.status(200).json({ success: true, token, user: { id: user._id, firstName: user.firstName, email } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, country } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { firstName, lastName, phone, address, city, country }, { new: true });
    res.status(200).json({ success: true, message: 'Profile updated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const favorite = new Favorite({ userId: req.user.id, hotelId });
    await favorite.save();
    res.status(201).json({ success: true, message: 'Added to favorites', data: favorite });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id }).populate('hotelId');
    res.status(200).json({ success: true, count: favorites.length, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { hotelId } = req.params;
    await Favorite.findOneAndDelete({ userId: req.user.id, hotelId });
    res.status(200).json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};