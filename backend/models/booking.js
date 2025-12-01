const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  hotelName: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  numberOfGuests: { type: Number, required: true, min: 1 },
  numberOfRooms: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
  pricePerNight: { type: Number, required: true },
  numberOfNights: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  specialRequests: String,
  guestDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);