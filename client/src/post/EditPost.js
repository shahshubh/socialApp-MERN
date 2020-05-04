import React, { Component } from 'react';

import Loading from '../loading/Loading';
import { singlePost, update } from './apiPost';
import { isAuthenticated } from "../auth";
import { Redirect } from 'react-router-dom';


class EditProfle extends Component {

    constructor() {
        super();
        this.state = {
            id: '',
            title: '',
            body: '',
            photo: '',
            postedBy: '',
            redirectToProfile: false,
            error: '',
            loading: false,
            fileSize: 0
        }
    }

    init = (postId) => {
        singlePost(postId)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToProfile: true })
                } else {
                    this.setState({ 
                        id: data._id,
                        title: data.title,
                        body: data.body,
                        photo: data.photo,
                        postedBy: data.postedBy._id,
                        error: ""
                    });
                }
            })
    }

    componentDidMount() {
        this.postData = new FormData()
        const postId = this.props.match.params.postId;
        this.init(postId);
    }

    isValid = () => {
        const { title, body, fileSize, photo, postedBy } = this.state;
        if(postedBy !== isAuthenticated().user._id){
            this.setState({ error: "You are not authorized to do this !!", loading: false });
            return false;
        }

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
            const postId = this.state.id;
            const token = isAuthenticated().token;
            update(postId, token, this.postData)
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

    editPostForm = (title, body) => (
        <form>
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

            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Update Post</button>
        </form>
    );

    render(){
        const { id, title, body, loading, redirectToProfile, error } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`}></Redirect>
        }
        const photoUrl = `${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`;

        return(
            <div className="container"> 
                <h2 className="mt-5 mb-5">Edit Post - {title}</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                <img 
                    style={{ display: loading ? "none" : "" , height: "200px", width: "auto" }} 
                    className="img-thumbnail" 
                    src={photoUrl} 
                    alt={title} 
                />
                {loading ? (
                    <Loading />
                ) : (
                    this.editPostForm(title, body)
                )}
            </div>
        )
    }
}

export default EditProfle;