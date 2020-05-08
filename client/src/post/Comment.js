import React, { Component } from 'react';
import { comment, uncomment } from './apiPost';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.jpg';
import Picker from 'emoji-picker-react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class Comment extends Component {
    constructor() {
        super()
        this.state = {
            text: "",
            error: "",
            chosenEmoji: null,
            showPicker: false
        }
    }

    handleChange = e => {
        this.setState({ text: e.target.value, error: "" })
    };

    isValid = () => {
        const { text } = this.state;
        if (!text.length > 0) {
            this.setState({
                error: "Comment cannot be empty"
            })
            return false
        }
        if (text.length > 150) {
            this.setState({
                error: "Comment cannot be more than 150 characters long"
            })
            return false
        }
        return true
    }

    addComment = e => {
        e.preventDefault();
        if (!isAuthenticated()) {
            this.setState({
                error: "Please Signin first to leave a comment"
            });
            return false
        }
        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const postId = this.props.postId;
            const commentText = { text: this.state.text }

            comment(userId, token, postId, commentText)
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        this.setState({
                            text: ""
                        });
                        // send the updated/fresh list of comments to the parent component
                        this.props.updateComments(data.comments);
                    }
                });
        }
    };

    deleteComment = (comment) => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = this.props.postId;

        uncomment(userId, token, postId, comment)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    // send the updated/fresh list of comments to the parent component
                    this.props.updateComments(data.comments);
                }
            });
    };

    deleteConfirmed = (comment) => {
        confirmAlert({
            title: 'Are you sure ?',
            message: 'you want to delete this comment.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.deleteComment(comment)
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    onEmojiClick = (event, emojiObject) => {
        let comment = this.state.text;
        comment = comment + emojiObject.emoji;
        this.setState({
            chosenEmoji: emojiObject,
            text: comment
        })
    }

    render() {
        const { text, error, showPicker } = this.state;
        const { comments } = this.props;

        return (
            <div>
                <h2 className="mt-5 mb-5">Leave a comment</h2>
                <form onSubmit={this.addComment}>
                    <div className="input-group">
                        <input
                            className="form-control"
                            type="text"
                            onChange={this.handleChange}
                            value={text}
                            placeholder="Leave a comment..."
                        />
                        <div>
                            <button type="button" onClick={() => this.setState({ showPicker: !showPicker })} className="btn btn-sm btn-raised btn-primary">Emoji</button>
                        </div>
                        <div className="input-group-append">
                            <button type="submit" className="btn btn-raised btn-sm btn-primary">Add comment</button>
                        </div>
                    </div>
                </form>
                {showPicker ? <Picker onEmojiClick={this.onEmojiClick} /> : ""}


                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                <div className="col-md-12">
                    <h3 className="text-primary">{comments.length} Comments</h3>
                    <hr />
                    {comments.reverse().map((comment, i) => (
                        <div key={i}>
                            <div>
                                <Link to={`/user/${comment.postedBy._id}`} >
                                    <img
                                        style={{ borderRadius: "50%", border: "1px solid black" }}
                                        className="float-left mr-2"
                                        height="30px"
                                        width="30px"
                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                                        onError={i => (i.target.src = DefaultProfile)}
                                        alt={comment.postedBy.name}
                                    />
                                </Link>
                                <div>
                                    <span>
                                        {isAuthenticated().user && isAuthenticated().user._id === comment.postedBy._id && (
                                            <>
                                                <span onClick={() => this.deleteConfirmed(comment)} className="text-danger float-right mr-1" style={{ cursor: "pointer" }}>
                                                    Remove
                                                    </span>
                                            </>
                                        )}
                                    </span>
                                    <p className="lead">{comment.text}</p>
                                </div>

                                <p className="font-italic mark">
                                    Posted by <Link to={`/user/${comment.postedBy._id}`}>{comment.postedBy.name}</Link>{" "} on {new Date(comment.created).toDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Comment;