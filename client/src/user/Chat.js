import React, { Component } from 'react';
import io from "socket.io-client";

import { read, getChats, getChatList } from './apiUser';
import { isAuthenticated } from "../auth";
import ScrollToBottom from 'react-scroll-to-bottom';

import '../css/Chat.css'
import DefaultProfile from '../images/avatar.jpg';

import {DisplayTime12Hour} from '../post/timeDifference';
import Picker from 'emoji-picker-react';
import Loading from '../loading/Loading';

const socketUrl = `${process.env.REACT_APP_API_URL}`;
let socket;

class Chat extends Component {
    constructor() {
        super();
        this.messagesEndRef = React.createRef();
        this.state = {
            socket: "",
            message: "",
            messages: [],
            sender: {},
            reciever: {},
            chatList: [],
            loading: false,
            onlineUsers: [],
            chosenEmoji: null,
            showPicker: false
        };
    }
    

    init = async (userId) => {
        const token = isAuthenticated().token;
        const user = await read(userId, token);
        if (user.error) {
            console.log(user.error)
        } else {
            return user;
        }
    };

    async componentWillMount() {
        this.setState({ loading: true });
        const senderId = this.props.match.params.user1Id;
        const recieverId = this.props.match.params.user2Id;
        const data = await getChats(senderId, recieverId)
        const chatList = await getChatList(senderId)
        
        if (data.error) {
            console.log(data.error)
        } else if(chatList.error){
            console.log(chatList.error)
        } else {
            this.setState({ messages: data, loading: false, chatList: chatList })
            //console.log(data);
        }
    }

    async componentDidMount() {
        this.scrollToBottom()
        const senderId = this.props.match.params.user1Id;
        const recieverId = this.props.match.params.user2Id;
        const sender = await this.init(senderId);
        const reciever = await this.init(recieverId);
        this.setState({ sender, reciever });

        await this.initSocket();
        socket.on('message', async (newChat) => {
            console.log('pushed');
            //await this.getChats()
            if (newChat.sender._id === recieverId || newChat.sender._id === senderId) {
                this.setState({ messages: [...this.state.messages, newChat] })
            }
        });

    }

    componentDidUpdate(){
        this.scrollToBottom()
    }

    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({behaviour: 'smooth'})
    }

    initSocket = () => {
        const { sender } = this.state;
        socket = io(socketUrl);
        socket.on('connect', () => {
            socket.emit('userInfo', sender);
        })
        this.setState({ socket });
    }

    sendMessage = (e) => {
        e.preventDefault();
        const { message, sender, reciever } = this.state;
        if (message) {
            socket.emit('sendMessage', message, sender, reciever, this.state.socket.id, () => {
                console.log('sent ', message);
                this.setState({ message: '', showPicker: false })
            })
        }
    }

    getChats = async () => {
        const { sender, reciever } = this.state;
        const data = await getChats(sender._id, reciever._id)
        if (data.error) {
            alert(data.error)
        } else {
            this.setState({ messages: data })
            //console.log(data);
        }
    }

    onEmojiClick = (event, emojiObject) => {
        let message = this.state.message;
        message = message + emojiObject.emoji;
        this.setState({
            chosenEmoji: emojiObject,
            message
        })
    }

    renderChat = (chat, i) => {
        if (chat.sender._id === isAuthenticated().user._id) {
            return <li key={i} className="chat-right">
                <div className="chat-hour">
                    { DisplayTime12Hour(new Date(chat.time)) }
                    {/* <br /> */}
                    {/* {new Date(chat.time).getDate()} / {new Date(chat.time).getMonth()+1} / {new Date(chat.time).getFullYear()} */}
                    <span className="fa fa-check-circle ml-1"></span>
                </div>
                <div className="chat-text">
                    {chat.message}
                </div>
            </li>
        } else {
            return <li key={i} className="chat-left">
                <div className="chat-avatar">

                    <div className="chat-name">{chat.sender.name}</div>
                </div>
                <div className="chat-text">
                    {chat.message}
                </div>
                <div className="chat-hour">
                    { DisplayTime12Hour(new Date(chat.time)) }
                    {/* <br /> */}
                    {/* {new Date(chat.time).getDate()} / {new Date(chat.time).getMonth()+1} / {new Date(chat.time).getFullYear()} */}
                    <span className="fa fa-check-circle ml-1"></span>
                </div>
            </li>
        }
    }

    render() {
        const { chatList, messages, reciever, sender, showPicker, loading } = this.state;
        return (
            
            <div className="container mb-5">
                <div className="page-title">
                    <div className="row gutters">
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                            <h5 className="title">Chats</h5>
                        </div>
                    </div>
                </div>
                { loading ? 
                    (<Loading />) 
                    : 
                    ("")
                }
                <div className="content-wrapper" style={{ display: loading ? "none" : "" }}>
                    <div className="row gutters">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="card card-chat m-0">
                                <div className="row no-gutters">
                                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                                        <div className="users-container" style={{ minHeight: "500px" }}>
                                            {/* <div className="chat-search-box">
                                                <div className="input-group">
                                                    <input className="form-control" placeholder="Search" />
                                                    <div className="input-group-btn">
                                                        <button type="button" className="btn btn-info">
                                                            <i className="fa fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div> */}
                                            <ul className="users" style={{ display: loading ? "none" : "" }} >
                                                { chatList.map((user, i) => (
                                                    <a key={i} href={`/chat/${sender._id}/${user._id}`}>
                                                        <li className="person" data-chat="person1">
                                                            <div className="user">
                                                                <img 
                                                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} 
                                                                    alt={user.name}
                                                                    onError={i => (i.target.src = DefaultProfile)} 
                                                                />
                                                            </div>
                                                            <p className="name-time">
                                                                <span className="name">{ user.name }</span>
                                                            </p>
                                                        </li>
                                                    </a>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9" 
                                        style={{
                                            borderRight: "1px solid black",
                                            borderBottom: "1px solid black"
                                        }}
                                    >
                                        <div className="selected-user">
                                            <span>To: <span className="name">{reciever.name}</span></span>
                                        </div>
                                        <ScrollToBottom className="chat-container">
                                            <div>
                                                <ul className="chat-box chatContainerScroll">
                                                    {messages.map((chat, i) => (
                                                        this.renderChat(chat, i)
                                                    ))}
                                                    <div ref={this.messagesEndRef} />
                                                </ul>
                                            </div>
                                        </ScrollToBottom>
                                        <div className="form-group mt-3 mb-3 mr-3 ml-3">
                                            <form onSubmit={this.sendMessage}>
                                                <div className="form-group mt-5">
                                                    <div className="input-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Your message..."
                                                            value={this.state.message}
                                                            name="message"
                                                            onChange={e =>
                                                                this.setState({
                                                                    message: e.target.value,
                                                                })
                                                            }
                                                        />
                                                        <button type="button" onClick={() => this.setState({ showPicker: !showPicker })} className="btn btn-sm btn-primary">
                                                            <i style={{fontSize: "20px"}} className="far fa-smile"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="btn btn-raised btn-primary pull-right"
                                                >
                                                    Send
                                                </button>
                                            </form>
                                            {showPicker ? <Picker onEmojiClick={this.onEmojiClick} /> : ""}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
