const express = require("express");
const { getMessages, sendMessage, createChat } = require("../controllers/chat");

const router = express.Router();

router.post("/message/send", sendMessage);
router.post("/", createChat);
router.get("/:id", getMessages);

module.exports = router;
