const express = require("express");
const { getFriend, getChat, getUserData, getFriendSuggest } = require("../controllers/user");
const router = express.Router();

router.get('/:id',getUserData)
router.get('/:id/friendSuggest',getFriendSuggest)
router.get('/:id/friend',getFriend)
router.get('/:id/chat',getChat)


module.exports=router