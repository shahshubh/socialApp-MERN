import React, { Component } from 'react';

import { singlePost, remove, like, unlike } from './apiPost';
import { Link, Redirect } from 'react-router-dom';
import Loading from '../loading/Loading';
import { isAuthenticated } from "../auth";

import Comment from './Comment';
import DefaultProfile from '../images/avatar.jpg'
import {timeDifference} from './timeDifference';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


class SinglePost extends Component {
    constructor() {
        super();
        this.state = {
            post: '',
            redirectToHome: false,
            redirectToSignin: false,
            like: false,
            likes: 0,
            comments: [],
            loading: false
        }
    }

    checkLike = (likes) => {
        const  userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1; //true if user found
        return match;
    };

    componentDidMount() {
        const postId = this.props.match.params.postId;
        singlePost(postId)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ 
                        post: data, 
                        likes: data.likes.length, 
                        like: this.checkLike(data.likes),
                        comments: data.comments
                    });
                }
            });
    };

    updateComments = comments => {
        this.setState({ comments });
    };

    likeToggle = () => {
        this.setState({ loading: true })
        if(!isAuthenticated()){
            this.setState({ redirectToSignin: true, loading: false })
            return false; //so that rest of code isn't executed
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;
        callApi(userId, token, postId)
        .then(data => {
            if(data.error){
                console.log(data.error)
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length,
                    loading: false
                });
            }
        });
    };

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove(postId, token)
        .then(data => {
            if(data.error){
                console.log(data.error)
            } else {
                this.setState({redirectToHome: true})
            }   
        })
    }

    deleteConfirmed = () => {
        confirmAlert({
            title: 'Are you sure ?',
            message: 'you want to delete this post.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.deletePost()
                },
                {
                    label: 'No',
                }
            ]
        });
    }
    

    renderPost = (post) => {
        const posterId = post.postedBy ? post.postedBy._id : "";
        const posterName = post.postedBy ? post.postedBy.name : " Unknown";

        const { like, likes, redirectToSignin, redirectToHome, comments } = this.state;

        if(redirectToHome){
            return <Redirect to='/'></Redirect>
        } else if(redirectToSignin){
            return <Redirect to='/signin'></Redirect>
        }
        return(
            <div className="card col-md-12 mb-5" style={{ padding: "0" }} >
                <div className="card-header">
                    <img 
                        className="mb-1 mr-2"
                        style={{ height: "40px", width: "40px", borderRadius: "50%"  }} 
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${posterId}`}
                        onError={i => (i.target.src = DefaultProfile)} 
                        alt={posterName}
                    />
                    <Link to={`/user/${posterId}`} style={{fontSize: "24px"}}>
                            {posterName}
                    </Link>
                    <p
                        style={{ marginBottom: "0" }}
                        className="pull-right mt-2"
                    >
                        <span className="ml-2">
                            <i className="far fa-clock"></i>{" "+timeDifference(new Date(), new Date(post.created))}
                        </span>
                    </p>
                </div>
                <Link to={`/post/${post._id}`}>
                    <img 
                        className="card-img-top" 
                        src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                        alt={post.title}
                        style={{ 
                            maxHeight: "700px",  
                            backgroundSize: "cover",
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: "50% 50%" }}
                    />
                </Link>
                    {like ? (
                        <h3>
                            <i onClick={this.likeToggle} className="fa fa-heart" style={{color: "red", padding: "10px", cursor: "pointer"}} aria-hidden="true"></i>
                            <i className="far fa-comments ml-3"></i> 
                        </h3>
                    ) : (
                        <h3>
                            <i onClick={this.likeToggle} className="fa fa-heart-o" style={{padding: "10px", cursor: "pointer"}} aria-hidden="true"></i>
                            <i className="far fa-comments ml-3"></i> 
                        </h3>
                    )}
                    <span style={{fontSize: "20px"}} className="ml-3" >{likes} Likes </span>
                
                <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.body}</p>
                    <Link
                        to={`/`}
                        className="btn btn-raised btn-sm btn-primary mr-5">
                        Back to posts
                    </Link>
                    {isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id && (
                        <>
                            <Link
                                to={`/post/edit/${post._id}`}
                                className="btn btn-raised btn-sm btn-warning mr-5">
                                    Edit Post
                            </Link>
                            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-sm btn-danger">
                                Delete Post
                            </button>
                        </>
                    )}
                    <Comment postId={post._id} comments={comments.reverse()} updateComments={this.updateComments} />
                </div>
            </div>
        );
    }

    render() {
        const { post, loading } = this.state;
        return (
            <div className="container">
                {(!post || loading) ? (
                    <Loading />
                ) : (
                    this.renderPost(post)
                )}
            </div>
        );
    }
}

export default SinglePost;