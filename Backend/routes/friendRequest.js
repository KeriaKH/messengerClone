const express = require("express");
const { getFriendRequest, sendFriendRequest } = require("../controllers/friendRequest");
const router = express.Router();

router.get('/:id',getFriendRequest)
router.post('/',sendFriendRequest)

module.exports=router