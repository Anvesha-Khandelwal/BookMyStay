const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, userController.updateUserProfile);
router.post('/favorites/:hotelId', auth, userController.addFavorite);
router.get('/favorites', auth, userController.getFavorites);
router.delete('/favorites/:hotelId', auth, userController.removeFavorite);

module.exports = router;