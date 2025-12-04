const express = require('express');
const Booking = require('../models/booking');
const Hotel = require('../models/hotel');
const router = express.Router();

// helper: difference in days
function diffNights(checkIn, checkOut) {
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

// helper: discount rules
function applyCoupon(baseAmount, couponCode) {
  let discountAmount = 0;

  if (!couponCode) return { discountAmount, finalAmount: baseAmount };

  const code = couponCode.toUpperCase().trim();

  if (code === 'FIRST20') {
    discountAmount = Math.min(baseAmount * 0.2, 2000); // 20% up to ₹2000
  } else if (code === 'UPI500') {
    discountAmount = 500;
  } else if (code === 'BREAKFAST') {
    // Fake: treat as ₹300 off
    discountAmount = 300;
  }

  const finalAmount = Math.max(0, baseAmount - discountAmount);
  return { discountAmount, finalAmount };
}

// POST /api/bookings  (create booking + bill)
router.post('/', async (req, res) => {
  try {
    const {
      hotelId,
      checkIn,
      checkOut,
      guests = 2,
      rooms = 1,
      couponCode,
    } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

    const nights = diffNights(checkIn, checkOut);
    const farePerNight = hotel.price;

    const baseAmount = farePerNight * nights * rooms;
    const taxAmount = Math.round(baseAmount * 0.12); // 12% GST

    const { discountAmount, finalAmount } = applyCoupon(
      baseAmount + taxAmount,
      couponCode
    );

    const totalPayable = finalAmount;

    const booking = await Booking.create({
      hotel: hotel._id,
      hotelName: hotel.name,
      checkIn,
      checkOut,
      nights,
      guests,
      rooms,
      farePerNight,
      baseAmount,
      taxAmount,
      discountAmount,
      totalPayable,
      couponCode,
    });

    res.json({
      message: 'Booking created',
      bookingId: booking._id,
      bill: {
        hotelName: hotel.name,
        checkIn,
        checkOut,
        nights,
        guests,
        rooms,
        farePerNight,
        baseAmount,
        taxAmount,
        discountAmount,
        totalPayable,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Booking creation failed' });
  }
});

module.exports = router;
