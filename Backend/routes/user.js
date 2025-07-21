const express = require("express");
const { getFriend, getChat, getUserData, getFriendSuggest, deleteFriend } = require("../controllers/user");
const router = express.Router();

router.get('/:id',getUserData)
router.get('/:id/friendSuggest',getFriendSuggest)
router.get('/:id/friend',getFriend)
router.get('/:id/chat',getChat)
router.delete('/friend/:senderId/:receiverId', deleteFriend) // Tốt nhất


module.exports=router