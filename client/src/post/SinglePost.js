import React, { Component } from 'react';

import { singlePost, remove, like, unlike } from './apiPost';
import { Link, Redirect } from 'react-router-dom';
import Loading from '../loading/Loading';
import { isAuthenticated } from "../auth";

import Comment from './Comment';



class SinglePost extends Component {
    constructor() {
        super();
        this.state = {
            post: '',
            redirectToHome: false,
            redirectToSignin: false,
            like: false,
            likes: 0,
            comments: []
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
        if(!isAuthenticated()){
            this.setState({ redirectToSignin: true })
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
                    likes: data.likes.length
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
        let answer = window.confirm("Are you sure you want to delete this post?");
        if(answer){
            this.deletePost();
        }
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

        return (
            <div className="card-body">
                <img
                    className="img-thumbnail mb-3"
                    style={{ height: "500px", width: "100%", objectFit: "cover" }}
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    alt={post.title}
                />
                
                {like ? (
                    <h3 onClick={this.likeToggle}><i className="fa fa-heart" style={{color: "red", padding: "10px"}} aria-hidden="true"></i>{likes} Likes</h3>
                ) : (
                    <h3 onClick={this.likeToggle}><i className="fa fa-heart-o" style={{padding: "10px"}} aria-hidden="true"></i>{likes} Likes</h3>
                )}

                <p className="card-text">{post.body}</p>
                <br />
                <p className="font-italic mark">
                    Posted by <Link to={`/user/${posterId}`}>{posterName}</Link>{" "} on {new Date(post.created).toDateString()}
                </p>
                <div className="d-inline-block">
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
                </div>
                {/* reverse comment so that latest conmments appear above on top */}
                <Comment postId={post._id} comments={comments.reverse()} updateComments={this.updateComments} />
            </div>
        );
    }

    render() {
        const { post } = this.state;
        return (
            <div className="container">
                <h2 className="display-2 mt-5 mb-5">{post.title}</h2>
                {!post ? (
                    <Loading />
                ) : (
                    this.renderPost(post)
                )}
            </div>
        );
    }
}

export default SinglePost;