require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const hotelRoutes = require('./routes/hotelroutes');
const bookingRoutes = require('./routes/bookingroutes');

const app = express();

// Middleware
app.use(cors()); // allow your frontend
app.use(express.json());

// Routes
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error('DB connection error:', err));
