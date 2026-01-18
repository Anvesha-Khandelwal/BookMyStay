require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// ✅ TEST ROUTES FIRST (before importing route files)
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "BookMyStay API is running 🚀",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "Server is healthy ✅",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Test works!" });
});

// ✅ IMPORT ROUTES (after basic routes)
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingroutes");
const hotelRoutes = require("./routes/hotelroutes");

// ✅ API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/hotels", hotelRoutes);

// ✅ 404 HANDLER (MUST BE LAST)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ✅ ERROR HANDLING
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Server Error',
    message: err.message
  });
});

// ✅ DATABASE CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ START SERVER
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
});