const express = require('express');
const http = require("http");
const socketio = require("socket.io");
const app = express();

const server =http.createServer(app);
const io = socketio(server);

const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
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


app.get('/api', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

const Socket = require('./models/socket');
const Chat = require('./models/chat');

io.on('connection', async (socket) => {
    socket.on('userInfo',(user) => {
        console.log("===============================");
        console.log("USer OUTER", user);
        console.log("===============================");
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
                console.log("ALREADY THERE ",res.user.email)
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
    socket.on('sendMessage', (message, sender, reciever, socketId, callback) => {
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
                io.to(res.socketId).emit('message', newChat);
                socket.emit('message', newChat);

            } else {
                console.log("OFFLINE")
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



app.use(function(err,req,res,next){
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({ error: "Unauthorized !" });
    }
});



server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})