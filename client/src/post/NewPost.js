import React, { Component } from 'react';

import { create } from "./apiPost";
import { isAuthenticated } from "../auth";
import Loading from '../loading/Loading';
import { Redirect } from 'react-router-dom';



class NewPost extends Component {

    constructor() {
        super();
        this.state = {
            title: "",
            body: "",
            photo: "",
            error: "",
            user: {},
            fileSize: 0,
            loading: false,
            redirectToProfile: false
        };
    }

    componentDidMount() {
        this.postData = new FormData();
        this.setState({user: isAuthenticated().user});
    }

    isValid = () => {
        const { title, body, fileSize, photo } = this.state;
        if (fileSize > 200000) {
            this.setState({ error: "File size should be less than 200 KB", loading: false });
            return false;
        }
        if(photo.length === 0){
            this.setState({ error: "Photo is required", loading: false });
            return false;
        }
        if (title.length === 0) {
            this.setState({ error: "Title is required", loading: false });
            return false;
        }
        if (body.length === 0) {
            this.setState({ error: "Body is required", loading: false });
            return false;
        }
        return true;
    }

    handleChange = e => {
        const value = e.target.name === 'photo' ? e.target.files[0] : e.target.value;
        const fileSize = e.target.name === 'photo' ? e.target.files[0].size : 0;
        //Form Data method set
        this.postData.set(e.target.name, value);
        this.setState({
            error: "",
            [e.target.name]: value,
            fileSize
        });
    };

    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true })
        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            create(userId, token, this.postData)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error, loading: false });
                    } else {
                        this.setState({ 
                            title: "",
                            body: "",
                            photo: "",
                            loading: false,
                            redirectToProfile: true
                        });
                        //console.log("NEW POST ",data);
                    }
                });
        }
    };

    newPostForm = (title, body, loading) => (
        <form style={{ display: loading ? "none" : "" }}>
            <div className="form-group">
                <label className="text-muted">Photo</label>
                <input
                    onChange={this.handleChange}
                    name="photo"
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input
                    onChange={this.handleChange}
                    name="title"
                    type="text"
                    className="form-control"
                    value={title}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea
                    onChange={this.handleChange}
                    type="text"
                    name="body"
                    className="form-control"
                    value={body}
                />
            </div>

            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Create Post</button>
        </form>
    );

    render() {

        const { title, body, user, loading, error, redirectToProfile } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`}></Redirect>
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create a new post</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                {this.newPostForm(title, body, loading)}
                {loading ? (
                    <Loading />
                ) : (
                        ""
                    )}
            </div>
        );
    }
}

export default NewPost;