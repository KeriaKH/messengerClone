const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const setupSocket=require('./socket/index')
const http = require("http");
const dotenv = require("dotenv");

dotenv.config();

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const chatRoute=require("./routes/chat");
const friendRequestRoute=require("./routes/friendRequest");
const cloudinaryRoute = require("./routes/cloudinary");




const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/friendRequest", friendRequestRoute);
app.use("/api/cloudinary", cloudinaryRoute);

const Port = process.env.PORT || 5000;

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    setupSocket(server);
    server.listen(Port, () => {
      console.log(`🚀 Server running on http://localhost:${Port}`);
      console.log("🔗 Connected URI:", process.env.MONGO_URI);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
