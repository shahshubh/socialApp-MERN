const express = require('express');
const http = require("http");
const app = express();

const server =http.createServer(app);
const io = require("socket.io").listen(server);

const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');


const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 8080;  
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('db connected'));

mongoose.connection.on('error', err => {
    console.log(`DB Error: ${err.message}`);
});




const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());




const Socket = require('./models/socket');
const Chat = require('./models/chat');

io.on('connection', async (socket) => {
    console.log('CLIENT CONNECTED')
    socket.on('userInfo',(user) => {
        Socket.findOne({email: user.email}, function(err,res) {
            if(!res){
                let newSocket = new Socket({
                    socketId: socket.id,
                    user: user,
                    email: user.email
                })
                newSocket.save((err,result) => {
                    if(err){
                        console.log(err)
                    } else {
                        console.log("ADDED TO DB ", socket.id)
                    }
                })
            } else {
                Socket.findOneAndUpdate({email: user.email} ,{$set: {"socketId": socket.id}}, (err,result) => {
                    if(err){
                        console.log(err)
                    }else{
                        console.log("UPDATED");
                    }
                })
            }   
        })
    })
    socket.on('sendMessage', (message, sender, reciever, callback) => {
        const senderId = sender._id;
        const recieverId = reciever._id;
        Socket.findOne({email: reciever.email})
        .exec(async function(err,res) {
            if(res!=null){
                console.log("SENT")
                const newChat = new Chat({
                    message,
                    reciever,
                    sender
                });
                await newChat.save((err,result) => {
                    if(err){
                        console.log(err)
                    } else {
                        console.log("--------------------------------");
                        console.log("CHAT SAVED");
                        console.log("--------------------------------");
                    }
                })
                // const allChats = await Chat.find({ $or: [{ 'reciever._id': recieverId, 'sender._id': senderId },{ 'sender._id': recieverId, 'reciever._id': senderId }] })
                console.log("emitting online")
                io.to(res.socketId).emit('message', newChat);
                socket.emit('message', newChat);

            } else {
                const newChat = new Chat({
                    message,
                    reciever,
                    sender
                });
                await newChat.save((err,result) => {
                    if(err){
                        console.log(err)
                    } else {
                        console.log("--------------------------------");
                        console.log("OFFLINE CHAT SAVED");
                        console.log("--------------------------------");
                    }
                })
                // const allChats = await Chat.find({ $or: [{ 'reciever._id': recieverId, 'sender._id': senderId },{ 'sender._id': recieverId, 'reciever._id': senderId }] })
                console.log("emitting offline")
                socket.emit('message', newChat);
            }
        })
        callback();
    });

    socket.on('disconnect', () => {
        Socket.findOne({socketId: socket.id})
        .remove((err, result) => {
            if(err){
                console.log(err)
            } else {
                console.log("DELETED");
            }
        })
        console.log("DISCONNECTED")
    })
})

app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', chatRoutes);


app.use('/static', express.static('public'));


app.use(function(err,req,res,next){
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({ error: "Unauthorized !" });
    }
});



server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})