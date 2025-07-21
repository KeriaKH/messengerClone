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
    console.log(data)
    const fr = await FriendRequest.create(data);
    if (!fr) return res.status(400).json({ message: "dữ liệu chưa hợp lệ" });
    return res.status(200).json(fr);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const addFriend=async(req,res)=>{
  const data=req.body
  try {
    const user=await User.findById(data.receiver)
    if(!user) return res.status(404).json({message:"không tìm thấy user"})
    user.friends.push(data.sender)
    await user.save()
    console.log(data._id)
    await FriendRequest.findByIdAndDelete(data._id)
    return res.status(200).json({message:"đã kết bạn thành công"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

const rejectFriend=async(req,res)=>{
  const {id}=req.params
  try {
    await FriendRequest.findByIdAndDelete(id)
    return res.status(200).json({message:"đã từ chối kết bạn thành công"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getFriendRequest, sendFriendRequest, addFriend, rejectFriend };
