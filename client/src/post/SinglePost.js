import React, { Component } from 'react';

import { singlePost, remove } from './apiPost';
import { Link, Redirect } from 'react-router-dom';
import Loading from '../loading/Loading';
import { isAuthenticated } from "../auth";



class SinglePost extends Component {
    constructor() {
        super();
        this.state = {
            post: '',
            redirectToHome: false
        }
    }

    componentDidMount() {
        const postId = this.props.match.params.postId;
        singlePost(postId)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ post: data });
                    console.log(data);
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
        if(this.state.redirectToHome){
            return <Redirect to='/'></Redirect>
        }

        return (
            <div className="card-body">
                <img
                    className="img-thumbnail mb-3"
                    style={{ height: "500px", width: "100%", objectFit: "cover" }}
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                    alt={post.title}
                />
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