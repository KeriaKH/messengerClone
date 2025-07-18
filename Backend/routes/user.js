const express = require("express");
const { getFriend, getChat } = require("../controllers/user");
const router = express.Router();


router.get('/:id/friend',getFriend)
router.get('/:id/chat',getChat)


module.exports=router