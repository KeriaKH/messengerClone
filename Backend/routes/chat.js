const express = require("express");
const { getMessages } = require("../controllers/chat");

const router = express.Router();


router.get('/:id',getMessages)



module.exports=router