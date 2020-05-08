const express = require('express')
const router = express.Router();

const { getChats, chatList } = require('../controllers/chat');

router.get('/chats/:senderId/:recieverId', getChats);
router.get('/chatlist/:senderId', chatList);

module.exports = router;