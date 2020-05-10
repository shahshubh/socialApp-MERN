import React, { Component } from 'react';

import { read, getChatList } from './apiUser';
import { isAuthenticated } from "../auth";

import '../css/Chat.css'
import DefaultProfile from '../images/avatar.jpg';

import Loading from '../loading/Loading';

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            sender: {},
            chatList: [],
            loading: false,
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
        const senderId = this.props.match.params.userId;
        const chatList = await getChatList(senderId)
        
        if(chatList.error){
            console.log(chatList.error)
        } else {
            this.setState({ loading: false, chatList: chatList })
        }
    }

    async componentDidMount() {
        const senderId = this.props.match.params.userId;
        const sender = await this.init(senderId);
        this.setState({ sender });
    }

    render() {
        const { chatList, sender, loading } = this.state;
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
                                            <div className="chat-search-box">
                                                <div className="input-group">
                                                    <input className="form-control" placeholder="Search" />
                                                    <div className="input-group-btn">
                                                        <button type="button" className="btn btn-info">
                                                            <i className="fa fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
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
                                            <span>To: <span className="name"></span></span>
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
