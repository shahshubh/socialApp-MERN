const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema;

const chatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    reciever: {
        type: Object,
        required: true
    },
    sender: {
        type: Object,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Chat", chatSchema);