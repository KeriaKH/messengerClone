const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    name: { type: String },
    isGroup: { type: Boolean, required: true },
    members: {
      type: [
        {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
          },
          nickName: { type: String },
        },
      ],
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("chat", chatSchema);
