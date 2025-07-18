const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const chatRoute=require("./routes/chat");

dotenv.config();

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

const Port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    app.listen(Port, () => {
      console.log(`🚀 Server running on http://localhost:${Port}`);
      console.log("🔗 Connected URI:", process.env.MONGO_URI);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
