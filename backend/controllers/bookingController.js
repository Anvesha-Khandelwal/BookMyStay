const Booking = require('../models/booking');
const Hotel = require('../models/hotel');
const { calculateBill } = require('../utils/calculatebill');

exports.createBooking = async (req, res) => {
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

    // 1. Validate hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, error: 'Hotel not found' });
    }

    // 2. Calculate nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    // 3. Calculate bill with offers
    const billDetails = await calculateBill({
      hotelPrice: hotel.price,
      numberOfNights,
      numberOfRooms
    }, offerCode);

    // 4. Generate booking ID
    const bookingId = `BMS${Date.now()}`;

    // 5. Create booking
    const booking = new Booking({
      bookingId,
      userId: req.user.id,
      hotelId: hotel._id,
      hotelName: hotel.name,
      checkInDate,
      checkOutDate,
      numberOfRooms,
      numberOfGuests,
      numberOfNights,
      basePrice: billDetails.basePrice,
      taxAmount: billDetails.taxAmount + billDetails.serviceFee,
      discountAmount: billDetails.discountAmount,
      offerApplied: billDetails.offerApplied,
      totalPrice: billDetails.totalPrice,
      guestDetails
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking,
        billDetails
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.validateOffer = async (req, res) => {
  try {
    const { offerCode, bookingAmount } = req.body;
    
    const billDetails = await calculateBill({
      hotelPrice: bookingAmount,
      numberOfNights: 1,
      numberOfRooms: 1
    }, offerCode);
    
    res.json({
      success: true,
      valid: billDetails.discountAmount > 0,
      discount: billDetails.discountAmount,
      offerApplied: billDetails.offerApplied
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};