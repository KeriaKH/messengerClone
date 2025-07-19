const User = require("../models/user");
const Chat = require("../models/chat");
const Message = require("../models/message");
const FriendRequest = require("../models/friendRequest");

const getFriend = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById({ _id: id })
      .select("friends -_id")
      .populate("friends", "name avatar isOnline email lastSeen");
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
    if (!chat) return res.status(404).json({ message: "không tìm thấy user" });

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

const getFriendSuggest=async(req,res)=>{
  const {id}=req.params
  try {
    const currentUser = await User.findById(id).populate("friends");

    const friendRequest=await FriendRequest.find({
      $or:[{sender:id},{receiver:id}]
    })

    const excludeIds=new Set([
      id.toString(),
      ...currentUser.friends.map(f=>f._id.toString()),
      ...friendRequest.map(f=>f.sender.toString()),
      ...friendRequest.map(f=>f.receiver.toString())
    ])

    const suggest=await User.find({
      _id:{$nin:Array.from(excludeIds)}
    }).limit(10).select("name avatar")

    return res.status(200).json(suggest)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }

}

const getUserData = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select(
      "name avatar email isOnline lastSeen"
    );
    if (!user) return res.status(404).json({ message: "không tìm thấy user" });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getFriend, getChat ,getUserData,getFriendSuggest};
