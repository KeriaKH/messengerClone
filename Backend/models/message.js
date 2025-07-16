const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    text: { type: String, required: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

module.exports=mongoose.model('message',messageSchema)
