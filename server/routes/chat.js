const express = require('express')
const router = express.Router();

const { getChats } = require('../controllers/chat');

router.get('/chats/:senderId/:recieverId', getChats);

module.exports = router;