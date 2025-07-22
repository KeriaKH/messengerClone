const express = require("express");
const {
  getFriend,
  getChat,
  getUserData,
  getFriendSuggest,
  deleteFriend,
  changeName,
  changeAvatar,
} = require("../controllers/user");
const router = express.Router();

router.put("/changeName", changeName);
router.put("/changeAvatar", changeAvatar);
router.get("/:id", getUserData);
router.get("/:id/friendSuggest", getFriendSuggest);
router.get("/:id/friend", getFriend);
router.get("/:id/chat", getChat);
router.delete("/friend/:senderId/:receiverId", deleteFriend);

module.exports = router;
