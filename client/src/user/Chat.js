import React, { Component } from 'react';
import io from "socket.io-client";

import { read, getChats } from './apiUser';
import { isAuthenticated } from "../auth";


const socketUrl = "http://localhost:8080/";
let socket;

class Chat extends Component{
    constructor(){
        super();        
        this.state = {
            socket: "",
            message: "",
            messages: [],
            sender: {},
            reciever: {},
            chatList: [],
            loading: false
        };
    }

    init = async (userId) => {
        const token = isAuthenticated().token; 
        const user = await read(userId,token);
        if(user.error){
            console.log(user.error)
        } else {
            return user;
        }
    };

    async componentWillMount(){
        this.setState({loading: true});
        const senderId = this.props.match.params.user1Id;
        const recieverId = this.props.match.params.user2Id;
        const data = await getChats(senderId,recieverId)
        if(data.error){
            alert(data.error)
        } else {
            this.setState({ messages: data })
            this.setState({loading: false});
            //console.log(data);
        }
    }

    async componentDidMount(){
        const senderId = this.props.match.params.user1Id;
        const recieverId = this.props.match.params.user2Id;
        const sender = await this.init(senderId);
        const reciever = await this.init(recieverId);
        this.setState({ sender,reciever });

        await this.initSocket();
        socket.on('message', async (newChat) => {
            console.log('pushed');
            //await this.getChats()
            if(newChat.sender._id === recieverId || newChat.sender._id === senderId){
                this.setState({messages: [...this.state.messages, newChat]})
            }
            this.setState({loading: false});
        });
    }

    initSocket = () => {
        const {sender} = this.state;
        socket = io(socketUrl);
        socket.on('connect', () => {
            socket.emit('userInfo',sender);
        })
        this.setState({socket});
    }

    sendMessage = (e) => {
        this.setState({loading: true});
        e.preventDefault();
        const {message,sender,reciever} = this.state;
        if(message){
            socket.emit('sendMessage',message,sender,reciever, this.state.socket.id, () => {
                console.log('sent ',message);
                this.setState({message: ''})
            })
        }
    }

    getChats = async () => {
        const {sender, reciever} = this.state;
        const data = await getChats(sender._id,reciever._id)
        if(data.error){
            alert(data.error)
        } else {
            this.setState({ messages: data })
            //console.log(data);
        }
    }

    render(){
        return(
            <div>
                <h1>Chat</h1>
                {this.state.loading ? (<h1>Loading</h1>) : ("") }
                {this.state.messages.map((chat,i) => (
                    <p key={i}>{chat.sender.name} - {chat.message} </p>
                ))}

                <form onSubmit={this.sendMessage}>
                    <div className="form-group mt-5">
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
                    </div>
                    <button
                        type="submit"
                        className="btn btn-raised btn-primary"
                    >
                        Send
                    </button>
                </form>
            </div>
        );
    }
}

export default Chat;
