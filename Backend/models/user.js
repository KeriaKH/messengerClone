const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    friends: [
      { type: mongoose.Schema.Types.ObjectId, ref: "user", default: [] },
    ],
    isOnline: { type: Boolean, required: true },
    lastSeen: { type: Date },
  },
  { timestamps: true }
);

module.exports=mongoose.model('user',userSchema)
