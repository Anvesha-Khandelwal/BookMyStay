const express = require("express");
const router = express.Router();
const Offer = require("../models/offers");

// Validate offer code
router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, error: "Offer code is required" });
    }

    const offer = await Offer.findOne({
      offerCode: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!offer) {
      return res.status(404).json({ success: false, error: "Invalid or expired offer code" });
    }

    // Check max usage
    if (offer.maxUsage && offer.usedCount >= offer.maxUsage) {
      return res.status(400).json({ success: false, error: "Offer code has reached maximum usage" });
    }

    res.json({
      success: true,
      message: `Offer applied! ${offer.discountValue}${offer.discountType === 'percentage' ? '%' : ' ₹'} off`,
      discount: offer.discountType === 'percentage' ? offer.discountValue : null, // For percentage discounts
      discountAmount: offer.discountType === 'fixed' ? offer.discountValue : null, // For fixed discounts
      offer: {
        code: offer.offerCode,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        maxDiscountAmount: offer.maxDiscountAmount,
        minBookingAmount: offer.minBookingAmount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

