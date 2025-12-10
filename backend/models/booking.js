const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  hotelName: { type: String, required: true },
  
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  numberOfRooms: { type: Number, required: true, default: 1 },
  numberOfGuests: { type: Number, required: true, default: 2 },
  numberOfNights: { type: Number, required: true },
  
  // Pricing
  basePrice: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  offerApplied: { type: String, default: null },
  totalPrice: { type: Number, required: true },
  
  // Guest Details
  guestDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);