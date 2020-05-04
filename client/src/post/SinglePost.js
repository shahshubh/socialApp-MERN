import React, { Component } from 'react';

import { singlePost } from './apiPost';
import { Link } from 'react-router-dom';
import Loading from '../loading/Loading';


class SinglePost extends Component {
    constructor() {
        super();
        this.state = {
            post: ''
        }
    }

    componentDidMount(){
        const postId = this.props.match.params.postId;
        singlePost(postId)
        .then(data => {
            if(data.error){
                console.log(data.error)
            } else {
                this.setState({post: data});
                console.log(data);
            }
        });
    }

    renderPost = (post) => {
        const posterId = post.postedBy ? post.postedBy._id : "";
        const posterName = post.postedBy ? post.postedBy.name : " Unknown";
        
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
                <Link
                    to={`/`}
                    className="btn btn-raised btn-sm btn-primary">
                    Back to posts
                </Link>
            </div>
        );
    }

    render(){
        const { post } = this.state;
        return(
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