require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");

const app = express();   // ✅ app MUST be before app.use()

// middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// DB connection
mongoose.connect(process.env.MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ DB connection error:", err));

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
