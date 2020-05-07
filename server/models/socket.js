const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema;

const socketSchema = new mongoose.Schema({
    socketId: {
        type: String,
        required: true
    },
    user: {
        type: Object,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Socket", socketSchema);