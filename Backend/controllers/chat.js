const Message = require("../models/message");
const Chat = require("../models/chat");

const getMessages = async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await Message.find({ chatId: id })
      .sort({ createdAt: -1 })
      .populate("sender", "name avatar isOnline");
    if (messages && messages.length >= 0) return res.status(200).json(messages);
    return res.status(404).json({ message: "không tìm thấy chat" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const createChat = async (req, res) => {
  const data = req.body;
  try {
    if (data.members.length === 2 && !data.isGroup) {
      const existingChat = await Chat.findOne({
        "members.id": { $all: data.members.id },
        isOnline: false,
        members: { $size: 2 },
      }).populate("members.id", "name avatar isOnline email lastSeen");
      if (existingChat) return res.status(200).json(existingChat);
    }
    const chat = await Chat.create(data);
    await chat.populate("members.id", "name avatar isOnline email lastSeen");
    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  const data = req.body;
  try {
    const message = await Message.create(data);
    if (message) {
      const populatedMessage = await Message.findById(message._id).populate(
        "sender",
        "name avatar isOnline"
      );
      return res.status(201).json(populatedMessage);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMessages, sendMessage,createChat };
