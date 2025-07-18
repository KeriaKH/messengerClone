const Message = require("../models/message");

const getMessages = async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await Message.find({ chatId: id }).sort({ createdAt: -1 }).populate("sender",'name avatar isOnline');
    if (messages && messages.length > 0) return res.status(200).json(messages);
    return res.status(404).json({ message: "không tìm thấy chat" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports={getMessages}
