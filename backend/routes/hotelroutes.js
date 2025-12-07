const express = require("express");
const router = express.Router();
const Hotel = require("../models/hotel");

// Get all hotels
router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json({ success: true, hotels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get hotel by ID
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, error: "Hotel not found" });
    }
    res.json({ success: true, hotel });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search hotels
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const hotels = await Hotel.find({
      $or: [
        { city: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } }
      ]
    });
    res.json({ success: true, hotels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
