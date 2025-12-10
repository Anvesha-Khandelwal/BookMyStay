const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Hotel = require("../models/hotel");
const { calculateBill } = require("../utils/calculatebill");
const auth = require("../middleware/auth");


router.post("/", auth, async (req, res) => {
  try {
    const {
      hotelId,
      checkInDate,
      checkOutDate,
      numberOfRooms,
      numberOfGuests,
      guestDetails,
      offerCode
    } = req.body;

    // Validate hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, error: "Hotel not found" });
    }

    // Calculate nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (numberOfNights <= 0) {
      return res.status(400).json({ success: false, error: "Invalid dates" });
    }

    // Calculate bill
    const billDetails = await calculateBill({
      hotelPrice: hotel.price,
      numberOfNights,
      numberOfRooms
    }, offerCode);

    // Generate booking ID
    const bookingId = `BMS${Date.now()}`;

    // Create booking
    const booking = new Booking({
      bookingId,
      hotel: hotelId,
      hotelName: hotel.name,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights: numberOfNights,
      guests: numberOfGuests,
      rooms: numberOfRooms,
      farePerNight: hotel.price,
      baseAmount: billDetails.basePrice,
      taxAmount: billDetails.taxAmount,
      discountAmount: billDetails.discountAmount,
      totalPayable: billDetails.totalPrice,
      couponCode: offerCode,
      paymentStatus: "PENDING",
      userId: req.user.id
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user bookings
router.get("/", auth, async (req, res) => {
  try {
    // Query bookings by userId - using find() not findById()
    // findById() expects a single document ID, not a filter object
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("hotel", "name image location")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get booking by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("hotel");
    
    if (!booking) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    // Check if booking belongs to user - handle both string and ObjectId comparisons
    const bookingUserId = booking.userId.toString();
    const requestUserId = req.user.id.toString();
    
    if (bookingUserId !== requestUserId) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
