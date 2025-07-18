const User = require("../models/user");
const Chat = require("../models/chat");
const Message = require("../models/message");

const getFriend = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById({ _id: id })
      .select("friends -_id")
      .populate("friends", "name avatar isOnline email");
    if (!user) return res.status(404).json({ message: "không tìm thấy user" });
    return res.status(200).json(user.friends);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getChat = async (req, res) => {
  const { id } = req.params;
  try {
    const chat = await Chat.find({ "members.id": id }).populate(
      "members.id",
      "name avatar isOnline email lastSeen"
    );
    console.log(chat[0].members)
    if (!chat) return res.status(404).json({ message: "không tìm thấy user" });
    // Với mỗi chat, lấy message cuối cùng
    const chatWithLastMessage = await Promise.all(
      chat.map(async (chat) => {
        const lastMessage = await Message.findOne({ chatId: chat._id })
          .populate("sender", "name avatar")
          .sort({ createdAt: -1 })
          .limit(1);

        return {
          ...chat.toObject(),
          lastMessage,
        };
      })
    );
    return res.status(200).json(chatWithLastMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getFriend, getChat };
