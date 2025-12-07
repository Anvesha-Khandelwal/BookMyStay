const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    hotelName: String,

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },

    nights: Number,
    guests: Number,
    rooms: Number,

    farePerNight: Number,
    baseAmount: Number,
    taxAmount: Number,
    discountAmount: Number,
    totalPayable: Number,

    couponCode: String,
    paymentStatus: { type: String, default: 'PENDING' },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bookingId: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
