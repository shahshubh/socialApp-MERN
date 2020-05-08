import React, { Component } from 'react';

import { list } from './apiPost';
import { Link } from 'react-router-dom';
import Loading from '../loading/Loading';
import DefaultProfile from '../images/avatar.jpg'

class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: []
        }
    }
    timeDifference = (current, previous) => {

        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;
    
        var elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed/1000) + ' seconds ago';   
        }
        else if (elapsed < msPerHour) {
            return Math.round(elapsed/msPerMinute) + ' minutes ago';   
        }
        else if (elapsed < msPerDay ) {
            return Math.round(elapsed/msPerHour ) + ' hours ago';   
        }
        else if (elapsed < msPerMonth) {
            return Math.round(elapsed/msPerDay) + ' days ago';   
        }
        else if (elapsed < msPerYear) {
            return Math.round(elapsed/msPerMonth) + ' months ago';   
        }
        else {
            return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
        }
    }

    componentDidMount() {
        list()
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ posts: data });
                }
            })
    }

    renderPosts = (posts) => {
        return (
            <div className="row">
                { posts.map((post, i) => {
                    const posterId = post.postedBy ? post.postedBy._id : "";
                    const posterName = post.postedBy ? post.postedBy.name : " Unknown";
                    return (
                        <div key={i} className="card col-md-12 mb-5" style={{ padding: "0" }} >
                            <div class="card-header">
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
                                        <i class="far fa-clock"></i>{" "+this.timeDifference(new Date(), new Date(post.created))}
                                    </span>
                                </p>
                            </div>
                            <Link to={`/post/${post._id}`}>
                                <img 
                                    class="card-img-top" 
                                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                    alt={post.title}
                                    style={{ 
                                        maxHeight: "700px",  
                                        backgroundSize: "cover",
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: "50% 50%" }}
                                />
                            </Link>
                            <div class="card-body">
                                <h5 class="card-title">{post.title}</h5>
                                <p class="card-text">{post.body}</p>
                                <Link
                                    style={{ 
                                        background: "#56ccf2", 
                                        background: "-webkit-linear-gradient(to left, #56ccf2, #2f80ed)",
                                        background: "linear-gradient(to left, #56ccf2, #2f80ed)",
                                        borderRadius: "20px",
                                        padding: "10px"
                                    }}
                                    to={`/post/${post._id}`}
                                    className="btn btn-raised btn-sm btn-primary">
                                    Read More
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    render(){
        const {posts} = this.state;
        return(
            <div className="container">
                {!posts.length ? (
                    <Loading />
                ) : (
                    this.renderPosts(posts)
                )}
            </div>
        );
    }
}

export default Posts;