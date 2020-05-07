const Chat  = require('../models/chat');

exports.getChats = (req,res) => {
    const senderId = req.params.senderId;
    const recieverId = req.params.recieverId;
    Chat.find({ $or: [{ 'reciever._id': recieverId, 'sender._id': senderId },{ 'sender._id': recieverId, 'reciever._id': senderId }] }, (err, chats) => {
        if(err || !chats){
            return res.status(400).json({
                error: err
            });
        }
        res.json(chats);
    });
};