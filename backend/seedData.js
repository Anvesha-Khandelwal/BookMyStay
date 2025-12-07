require("dotenv").config();
const mongoose = require("mongoose");
const Hotel = require("./models/hotel");
const Offer = require("./models/offers");

const hotels = [
  {
    name: "Ocean Pearl Resort",
    city: "Bali",
    location: "Bali, Indonesia",
    price: 5000,
    rating: 4.7,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&h=800&fit=crop&auto=format",
    description: "Beachside resort with infinity pool & spa. Experience luxury in the heart of Bali.",
    amenities: ["Free WiFi", "Swimming Pool", "Spa", "Restaurant", "Beach Access", "Air Conditioning"],
    attractions: ["Ubud Forest", "Kuta Beach", "Waterfalls", "Temple Tours"]
  },
  {
    name: "Desert Mirage Hotel",
    city: "Dubai",
    location: "Dubai, UAE",
    price: 8000,
    rating: 4.9,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop&auto=format",
    description: "Luxury hotel near city center with stunning views of the Burj Khalifa.",
    amenities: ["Free WiFi", "Gym", "Spa", "Restaurant", "Room Service", "Concierge"],
    attractions: ["Burj Khalifa", "Desert Safari", "Dubai Mall", "Beaches"]
  },
  {
    name: "Sea Breeze Resort",
    city: "Goa",
    location: "Goa, India",
    price: 4500,
    rating: 4.7,
    reviews: 180,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop&auto=format",
    description: "Beachfront resort with direct access to pristine beaches and water sports.",
    amenities: ["Free WiFi", "Beach Access", "Water Sports", "Restaurant", "Bar", "Parking"],
    attractions: ["Baga Beach", "Chapora Fort", "Tito's Lane", "Anjuna Beach"]
  },
  {
    name: "Seaside Villa",
    city: "Goa",
    location: "Goa, India",
    price: 3500,
    rating: 4.5,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop&auto=format",
    description: "Cozy beachside villa perfect for families and couples.",
    amenities: ["Free WiFi", "Kitchen", "Beach Access", "Parking", "Air Conditioning"],
    attractions: ["Baga Beach", "Fort Aguada", "Night Market", "Dudhsagar Falls"]
  },
  {
    name: "Mountain View Hotel",
    city: "Manali",
    location: "Manali, Himachal Pradesh, India",
    price: 3000,
    rating: 4.6,
    reviews: 150,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop&auto=format",
    description: "Scenic mountain hotel with breathtaking views of the Himalayas.",
    amenities: ["Free WiFi", "Heating", "Restaurant", "Parking", "Room Service"],
    attractions: ["Rohtang Pass", "Solang Valley", "Hadimba Temple", "Mall Road"]
  },
  {
    name: "Heritage Palace Hotel",
    city: "Jaipur",
    location: "Jaipur, Rajasthan, India",
    price: 4000,
    rating: 4.8,
    reviews: 280,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop&auto=format",
    description: "Luxurious heritage hotel showcasing royal Rajasthani architecture.",
    amenities: ["Free WiFi", "Spa", "Restaurant", "Pool", "Concierge", "Parking"],
    attractions: ["Amber Fort", "City Palace", "Hawa Mahal", "Jantar Mantar"]
  },
  {
    name: "Tech Park Hotel",
    city: "Bangalore",
    location: "Bangalore, Karnataka, India",
    price: 3500,
    rating: 4.4,
    reviews: 195,
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&h=600&fit=crop",
    description: "Modern business hotel near IT parks with excellent connectivity.",
    amenities: ["Free WiFi", "Business Center", "Gym", "Restaurant", "Conference Rooms"],
    attractions: ["Lalbagh", "Cubbon Park", "ISKCON Temple", "UB City"]
  },
  {
    name: "Marine Drive Hotel",
    city: "Mumbai",
    location: "Mumbai, Maharashtra, India",
    price: 5000,
    rating: 4.6,
    reviews: 240,
    image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=600&fit=crop",
    description: "Premium hotel overlooking the Arabian Sea with stunning sunset views.",
    amenities: ["Free WiFi", "Sea View", "Restaurant", "Spa", "Pool", "Concierge"],
    attractions: ["Gateway of India", "Marine Drive", "Elephanta Caves", "Juhu Beach"]
  }
];

const offers = [
  {
    offerCode: "WELCOME20",
    discountType: "percentage",
    discountValue: 20,
    maxDiscountAmount: 2000,
    minBookingAmount: 5000,
    isActive: true,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    maxUsage: 1000
  },
  {
    offerCode: "FIRST50",
    discountType: "fixed",
    discountValue: 500,
    minBookingAmount: 3000,
    isActive: true,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    maxUsage: 500
  },
  {
    offerCode: "SUMMER15",
    discountType: "percentage",
    discountValue: 15,
    maxDiscountAmount: 1500,
    minBookingAmount: 4000,
    isActive: true,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
    maxUsage: 200
  }
];

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Hotel.deleteMany({});
    await Offer.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Insert hotels
    const insertedHotels = await Hotel.insertMany(hotels);
    console.log(`✅ Inserted ${insertedHotels.length} hotels`);

    // Insert offers
    const insertedOffers = await Offer.insertMany(offers);
    console.log(`✅ Inserted ${insertedOffers.length} offers`);

    console.log("🎉 Seed data inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
