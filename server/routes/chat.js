const express = require('express')
const router = express.Router();

const { getChats, chatList, getOnlineUsers, getAllChatsRn } = require('../controllers/chat');

router.get('/chats/:senderId/:recieverId', getChats);
router.get('/chatlist/:senderId', chatList);
router.get('/online/users', getOnlineUsers);

router.get('/rn/allchats',getAllChatsRn)

module.exports = router;