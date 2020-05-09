const express = require('express')
const router = express.Router();

const { getChats, chatList, getOnlineUsers } = require('../controllers/chat');

router.get('/chats/:senderId/:recieverId', getChats);
router.get('/chatlist/:senderId', chatList);
router.get('/online/users', getOnlineUsers);

module.exports = router;