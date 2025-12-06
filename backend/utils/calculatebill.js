const Offer = require('../models/Offer');

async function calculateBill(bookingData, offerCode = null) {
  const { hotelPrice, numberOfNights, numberOfRooms } = bookingData;
  
  // 1. Calculate Base Price
  const basePrice = hotelPrice * numberOfNights * numberOfRooms;
  
  // 2. Apply Discount (if offer code provided)
  let discountAmount = 0;
  let offerApplied = null;
  
  if (offerCode) {
    const offer = await Offer.findOne({ 
      offerCode: offerCode.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });
    
    if (offer && basePrice >= offer.minBookingAmount) {
      if (offer.discountType === 'percentage') {
        discountAmount = (basePrice * offer.discountValue) / 100;
        
        // Apply max discount cap if exists
        if (offer.maxDiscountAmount && discountAmount > offer.maxDiscountAmount) {
          discountAmount = offer.maxDiscountAmount;
        }
      } else if (offer.discountType === 'fixed') {
        discountAmount = offer.discountValue;
      }
      
      offerApplied = offer.offerCode;
      
      // Increment usage count
      await Offer.findByIdAndUpdate(offer._id, { 
        $inc: { usedCount: 1 } 
      });
    }
  }
  
  // 3. Calculate subtotal after discount
  const subtotal = basePrice - discountAmount;
  
  // 4. Calculate taxes (12% GST)
  const taxPercentage = parseFloat(process.env.TAX_PERCENTAGE) || 12;
  const taxAmount = (subtotal * taxPercentage) / 100;
  
  // 5. Calculate service fee (5%)
  const serviceFeePercentage = parseFloat(process.env.SERVICE_FEE_PERCENTAGE) || 5;
  const serviceFee = (subtotal * serviceFeePercentage) / 100;
  
  // 6. Calculate total
  const totalPrice = subtotal + taxAmount + serviceFee;
  
  return {
    basePrice: Math.round(basePrice),
    discountAmount: Math.round(discountAmount),
    offerApplied,
    subtotal: Math.round(subtotal),
    taxAmount: Math.round(taxAmount),
    serviceFee: Math.round(serviceFee),
    totalPrice: Math.round(totalPrice),
    breakdown: {
      pricePerNight: hotelPrice,
      numberOfNights,
      numberOfRooms,
      taxPercentage,
      serviceFeePercentage
    }
  };
}

module.exports = { calculateBill };s