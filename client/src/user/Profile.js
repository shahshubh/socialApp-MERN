import React, { Component } from 'react';

import { isAuthenticated } from "../auth";
import { Redirect, Link } from 'react-router-dom';
import { read } from "./apiUser";
import DefaultProfile from '../images/avatar.jpg';
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import { listByUser } from '../post/apiPost';
import '../css/Profile.css';

import { Tabs, Tab } from 'react-bootstrap-tabs';

import Loading from '../loading/Loading';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            // user: "",
            user: { following: [], followers: [] },
            redirectToSignin: false,
            following: false,
            error: "",
            posts: [],
            loading: false
        }
    }

    // check follow
    checkFollow = (user) => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            return follower._id === jwt.user._id
        })
        return match
    }


    clickFollowButton = callApi => {
        this.setState({ loading: true })
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.user._id)
            .then(data => {
                if (data.error) {
                    
                    this.setState({ error: data.error })
                } else {
                    this.setState({ user: data, following: !this.state.following, loading: false })
                }
            })
    }

    // profileUnfollow = (unfollowId) => {
    //     const userId = isAuthenticated().user._id;
    //     const token = isAuthenticated().token;
    //     unfollow(userId, token, unfollowId)
    //     .then(data => {
    //         if (data.error) {
    //             this.setState({ error: data.error })
    //         } else {
    //             this.setState({ user: data })
    //         }
    //     })
    // }

    // unfollowClick = (e) => {
    //     const unfollowId = e.target.getAttribute("data-index");
    //     this.profileUnfollow(unfollowId);
    // }

    init = (userId) => {
        this.setState({ loading: true })
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToSignin: true });
                } else {
                    let following = this.checkFollow(data);
                    this.setState({ user: data, following });
                    this.loadPosts(data._id);
                }
            });
    };

    loadPosts = (userId) => {
        const token = isAuthenticated().token;
        listByUser(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ posts: data, loading: false });
                }
            })
    }

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
    }

    renderProfile = () => {
        const { user, following, posts } = this.state;
        const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile;
        let followingBadge = <p style={{ marginBottom: "0" }}><span className="badge badge-pill badge-primary">{user.following.length}</span> Following</p>
        let followersBadge = <p style={{ marginBottom: "0" }}><span className="badge badge-pill badge-success">{user.followers.length}</span> Followers</p>
        let postsBadge = <p style={{ marginBottom: "0" }}><span className="badge badge-pill badge-warning">{posts.length}</span> Posts</p>
        return <div className="user-profile">
            <div className="row">
                <div className="col-md-4">
                    <div className="profile-info-left">
                        <div className="text-center">
                            <img 
                                height="300"
                                width="300"
                                src={photoUrl} 
                                alt={user.name} 
                                onError={i => (i.target.src = DefaultProfile)} 
                                className="avatar img-circle" 
                            />
                            <h2 className="mt-2" >{user.name}</h2>
                        </div>
                        <div className="action-buttons">
                            {isAuthenticated().user && isAuthenticated().user._id === user._id ? (
                                <>
                                <div className="row">
                                    <div className="col-md-4 col-xs-6">
                                        <Link 
                                            className="btn btn-sm btn-raised btn-primary"
                                            to={`/post/create`}
                                        >
                                            Create Post
                                        </Link>
                                    </div>
                                    <div className="col-md-4 col-xs-6">
                                        <Link 
                                        className="btn btn-sm btn-raised btn-dark"
                                            to={`/user/edit/${user._id}`}
                                        >
                                            Edit Profile
                                        </Link>
                                    </div>

                                </div>
                                <div className="mt-2">
                                    <DeleteUser userId={user._id} />
                                </div>
                                </>
                            ): (
                                <div className="row">
                                    <div className="col-md-6 col-xs-6">
                                        <Link 
                                            className="btn btn-sm btn-raised btn-success ml-3"
                                            to={`/chat/${isAuthenticated().user._id}/${user._id}`}
                                        >
                                            Message
                                        </Link>
                                    </div>
                                    <div className="col-md-6 col-xs-6">
                                        <FollowProfileButton following={following} onButtonClick={this.clickFollowButton} />
                                    </div>
                                </div>                                            
                            )}
                            
                        </div>
                        <div className="section">
                            <h3>About Me</h3>
                            <p>{user.about}</p>
                        </div>
                        <div className="section">
                            <h3>Statistics</h3>
                            <p><span className="badge badge-pill badge-primary">{user.following.length}</span> Following</p>
                            <p><span className="badge badge-pill badge-success">{user.followers.length}</span> Followers</p>
                            <p><span className="badge badge-pill badge-warning">{posts.length}</span> Posts</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="profile-info-right">
                        <Tabs onSelect={(index, label) => console.log(label + ' selected')}>
                            <Tab label={postsBadge} className="tab-title-name">
                                <div className="row">
                                {posts.map((post, i) => (
                                    <div key={i} style={{ paddingBottom: "15px" }} className="col-md-4">
                                        <Link to={`/post/${post._id}`} >
                                            <figure class="snip1205 red">
                                                <img 
                                                    style={{ objectFit: "cover", padding: "0" }}
                                                    height="200"
                                                    width="200"
                                                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                                    alt={post.title} 
                                                />
                                                <i class="fas fa-heart">
                                                    <br />
                                                    <span style={{ color: "white", fontSize: "20px" }} >{post.likes.length}</span>
                                                </i>
                                            </figure>
                                        </Link>
                                    </div>
                                ))}
                                </div>
                            </Tab>
                            <Tab label={followersBadge}  className="tab-title-name">
                                {user.followers.map((person, i) => (
                                    <div key={i} className="media user-follower">
                                        <img 
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                            onError={i => (i.target.src = DefaultProfile)}
                                            alt={person.name} 
                                            className="media-object pull-left mr-2" 
                                        />
                                        <div className="media-body">
                                            <Link to={`/user/${person._id}`} >
                                                {person.name}<br /><span className="text-muted username">@{person.name}</span>
                                            </Link>
                                            {/* <button type="button" className="btn btn-sm btn-toggle-following pull-right"><i className="fa fa-checkmark-round"></i> <span>Following</span></button> */}
                                        </div>
                                    </div>
                                ))}
                            </Tab>

                            <Tab label={followingBadge} className="tab-title-name">
                                {user.following.map((person, i) => (
                                    <div key={i} className="media user-following">
                                        <img 
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                            onError={i => (i.target.src = DefaultProfile)}
                                            alt={person.name} 
                                            className="media-object pull-left mr-2" 
                                        />
                                        <div className="media-body">
                                            <Link to={`/user/${person._id}`} >
                                                { person.name }<br /><span className="text-muted username">@{person.name}</span>
                                            </Link>
                                            {/* <button data-index = {person._id} onClick={this.unfollowClick} type="button" className="btn btn-sm btn-toggle-following pull-right"><i className="fa fa-checkmark-round"></i> <span>Unfollow</span></button> */}
                                        </div>
                                    </div>
                                ))}
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    }


    render() {
        const { redirectToSignin, user, loading } = this.state;
        console.log("state user", user);
        if (redirectToSignin) {
            return <Redirect to='/signin' />
        }


        return (
            <div className="container">
                { loading ? (
                    <Loading />
                ) : (
                    this.renderProfile()
                ) }
            </div>
        );
    }
}

export default Profile;