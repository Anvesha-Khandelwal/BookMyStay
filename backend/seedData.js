require("dotenv").config({ path: "./.env" });

const mongoose = require("mongoose");

console.log("MONGO_URI =", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ DB Connected for seeding");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  });
