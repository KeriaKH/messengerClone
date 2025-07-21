const express = require("express");
const { getFriendRequest, sendFriendRequest, addFriend, rejectFriend } = require("../controllers/friendRequest");
const router = express.Router();

router.post('/reject/:id', rejectFriend)
router.post('/add',addFriend)
router.get('/:id',getFriendRequest)
router.post('/',sendFriendRequest)


module.exports=router