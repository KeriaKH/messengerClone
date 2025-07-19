const FriendRequest = require("../models/friendRequest");

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
    console.log(data)
    const fr = await FriendRequest.create(data);
    if (!fr) return res.status(400).json({ message: "dữ liệu chưa hợp lệ" });
    return res.status(200).json(fr);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getFriendRequest, sendFriendRequest };
