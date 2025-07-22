const FriendRequest = require("../models/friendRequest");
const User = require("../models/user");

const getFriendRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const frRequest = await FriendRequest.find({ receiver: id }).populate(
      "sender",
      "name avatar"
    );
    if (!frRequest)
      return res.status(404).json({ message: "không tìm thấy user" });
    return res.status(200).json(frRequest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const sendFriendRequest = async (req, res) => {
  const data = req.body;
  try {
    const fr = await FriendRequest.create(data);
    if (!fr) return res.status(400).json({ message: "dữ liệu chưa hợp lệ" });
    return res.status(200).json(fr);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const addFriend = async (req, res) => {
  const data = req.body;
  try {
    const [sender, receiver] = await Promise.all([
      User.findById(data.sender),
      User.findById(data.receiver),
    ]);
    if (!sender || !receiver) {
      return res.status(404).json({ message: "không tìm thấy user" });
    }
    sender.friends.push(data.receiver);
    receiver.friends.push(data.sender);
    await Promise.all([sender.save(), receiver.save()]);
    await FriendRequest.findByIdAndDelete(data._id);
    return res.status(200).json({ message: "đã kết bạn thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const rejectFriend = async (req, res) => {
  const { id } = req.params;
  try {
    await FriendRequest.findByIdAndDelete(id);
    return res.status(200).json({ message: "đã từ chối kết bạn thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getFriendRequest,
  sendFriendRequest,
  addFriend,
  rejectFriend,
};
