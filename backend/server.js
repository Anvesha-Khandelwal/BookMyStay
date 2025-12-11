require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ADD THIS

const authRoutes = require("./routes/authRoutes"); // FIXED: Consistent name
const bookingRoutes = require("./routes/bookingroutes");
const hotelRoutes = require("./routes/hotelroutes");

const app = express();

// ✅ MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS - Allow frontend to connect
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500'],
  credentials: true
}));

// ✅ ROUTES (REMOVED DUPLICATE)
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/hotels", hotelRoutes);

// ✅ HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running ✅" });
});

// ✅ ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || "Server Error"
  });
});

// ✅ DATABASE CONNECTION
mongoose
  .connect(process.env.MONGO_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB error:", err));

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});