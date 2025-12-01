const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

router.get('/', hotelController.getAllHotels);
router.get('/city/:city', hotelController.getHotelsByCity);
router.get('/search', hotelController.searchHotels);
router.post('/filter', hotelController.filterHotels);
router.get('/:id', hotelController.getHotelById);
router.get('/:id/attractions', hotelController.getNearbyAttractions);

module.exports = router;