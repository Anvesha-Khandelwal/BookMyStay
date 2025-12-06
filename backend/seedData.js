require("dotenv").config({ path: "./.env" });
console.log("MONGO_URI =", process.env.MONGO_URI);

const mongoose = require('mongoose');


// Simple Hotel Schema
const hotelSchema = new mongoose.Schema({
  hotelId: Number,
  name: String,
  city: String,
  location: String,
  price: Number,
  rating: Number,
  reviews: Number,
  image: String,
  description: String,
  amenities: [String],
  attractions: [String]
});

const Hotel = mongoose.model('Hotel', hotelSchema);

// Connect and seed
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas');
    
    // Clear old data
    await Hotel.deleteMany({});
    console.log('🗑️  Cleared old data');
    
    // Add sample hotels
    const hotels = [
      {
        hotelId: 1,
        name: "Sea Breeze Resort",
        city: "Bali",
        location: "Bali, Indonesia",
        price: 129,
        rating: 4.8,
        reviews: 324,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
        description: "Luxury beachside stay with pool, spa, and ocean view.",
        amenities: ["Free WiFi", "Swimming Pool", "Spa", "Ocean View"],
        attractions: ["Ubud Monkey Forest - 15 min", "Tanah Lot Temple - 20 min"]
      },
      {
        hotelId: 2,
        name: "Royal Heritage Hotel",
        city: "Dubai",
        location: "Dubai, UAE",
        price: 299,
        rating: 4.9,
        reviews: 512,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        description: "Luxurious 5-star hotel in Dubai.",
        amenities: ["Rooftop Pool", "Fine Dining", "Spa", "Concierge"],
        attractions: ["Burj Khalifa - 5 min", "Dubai Mall - 5 min"]
      },
      {
        hotelId: 3,
        name: "Mountain View Lodge",
        city: "Goa",
        location: "Goa, India",
        price: 89,
        rating: 4.5,
        reviews: 412,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        description: "Peaceful retreat with Goan cuisine.",
        amenities: ["Garden View", "Pool", "Free Breakfast", "Yoga"],
        attractions: ["Dudhsagar Falls - 30 min", "Anjuna Beach - 20 min"]
      }
    ];
    
    await Hotel.insertMany(hotels);
    console.log('✅ Added', hotels.length, 'hotels');
    console.log('🎉 Database seeded successfully!');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });