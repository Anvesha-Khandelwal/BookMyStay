const Booking = require('../models/booking');
const Hotel = require('../models/hotel');

exports.createBooking = async (req, res) => {
  try {
    const { hotelId, checkInDate, checkOutDate, numberOfGuests, numberOfRooms, guestDetails, specialRequests } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ success: false, error: 'Hotel not found' });

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = hotel.price * numberOfNights * numberOfRooms;
    const bookingId = `BK${Date.now()}`;

    const booking = new Booking({
      bookingId,
      userId: req.user.id,
      hotelId,
      hotelName: hotel.name,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      numberOfRooms,
      totalPrice,
      pricePerNight: hotel.price,
      numberOfNights,
      guestDetails,
      specialRequests
    });

    await booking.save();
    res.status(201).json({ success: true, message: 'Booking created', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('hotelId');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('hotelId');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus, updatedAt: Date.now() },
      { new: true }
    );
    res.status(200).json({ success: true, message: 'Booking updated', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', paymentStatus: 'refunded' },
      { new: true }
    );
    res.status(200).json({ success: true, message: 'Booking cancelled', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { hotelId, checkInDate, checkOutDate } = req.body;
    const conflicts = await Booking.find({
      hotelId,
      status: { $ne: 'cancelled' },
      $or: [{ checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }]
    });
    res.status(200).json({ success: true, isAvailable: conflicts.length === 0 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};