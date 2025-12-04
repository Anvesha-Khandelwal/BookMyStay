const express = require('express');
const Hotel = require('../models/hotel');
const router = express.Router();

// Seed with a few hotels (call this once from Postman or browser)
router.post('/seed', async (req, res) => {
  try {
    const sampleHotels = [
      {
        name: 'Sea Breeze Resort',
        city: 'Bali',
        location: 'Bali, Indonesia',
        price: 3500,
        rating: 4.8,
        reviews: 324,
        image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
        amenities: ['Free WiFi', 'Pool', 'Spa', 'Airport Shuttle', 'Free Parking'],
        attractions: ['Beach - 10 min', 'Monkey Forest - 20 min'],
      },
      {
        name: 'Mountain View Lodge',
        city: 'Manali',
        location: 'Manali, India',
        price: 2800,
        rating: 4.6,
        reviews: 220,
        image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
        amenities: ['Heater', 'Breakfast', 'Parking'],
        attractions: ['Mall Road - 8 min', 'Snow Point - 30 min'],
      },
    ];

    await Hotel.deleteMany({});
    const created = await Hotel.insertMany(sampleHotels);
    res.json({ message: 'Seeded', data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Seeding failed' });
  }
});

// Get all hotels
router.get('/', async (req, res) => {
  const hotels = await Hotel.find();
  res.json(hotels);
});

// Get single hotel by id
router.get('/:id', async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
  res.json(hotel);
});

module.exports = router;
