const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const HotelSchema = new mongoose.Schema({
  id: Number,
  name: String,
  location: String,
  city: String,
  price: Number,
  rating: Number,
  image: String,
  attractions: Array
});

const BookingSchema = new mongoose.Schema({
  name:String, email:String, checkin:String, checkout:String, guests:String, hotelId:Number, paymentMode:String, coupon:String
});

const Hotel = mongoose.model('Hotel', HotelSchema);
const Booking = mongoose.model('Booking', BookingSchema);

app.get('/hotels', async (req, res) => {
  const {city, sort, minRating, maxPrice} = req.query;
  let data = await Hotel.find(city ? {city: new RegExp(city, 'i')} : {});
  if(minRating) data = data.filter(h => h.rating >= minRating);
  if(maxPrice) data = data.filter(h => h.price <= maxPrice);

  if(sort === "price-low") data.sort((a,b)=>a.price-b.price);
  if(sort === "price-high") data.sort((a,b)=>b.price-a.price);
  if(sort === "rating") data.sort((a,b)=>b.rating-a.rating);

  res.json(data);
});

app.post('/book', (req, res) => {
  new Booking(req.body).save();
  res.json({message:"Booked!"});
});

app.listen(process.env.PORT, ()=> console.log("Server running"));
app.get("/hotels",(req,res)=>{
  const { city, sort } = req.query;
  let data = hotels.filter(h=>h.city.toLowerCase().includes(city.toLowerCase()));
  if(sort==="rating") data.sort((a,b)=>b.rating-a.rating);
  if(sort==="low") data.sort((a,b)=>a.price-b.price);
  if(sort==="high") data.sort((a,b)=>b.price-a.price);
  res.json(data);
});
