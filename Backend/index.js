const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true                
}));

const Port = process.env.PORT || 3008;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(Port, () => {
      console.log(`🚀 Server running on http://localhost:${Port}`);
      console.log('🔗 Connected URI:', process.env.MONGO_URI);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });