import React, { Component } from 'react';

import Loading from '../loading/Loading';

import { read, update, updateUser } from "./apiUser";
import { isAuthenticated } from "../auth";
import { Redirect } from 'react-router-dom';
import DefaultProfile from '../images/avatar.jpg';


class EditProfle extends Component {

    constructor() {
        super();
        this.state = {
            id: "",
            name: "",
            email: "",
            about: "",
            password: "",
            loading: false,
            redirectToProfile: false,
            error: "",
            fileSize: 0
        }
    }

    init = (userId) => {
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToProfile: true })
                } else {
                    this.setState({ 
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        error: "" ,
                        about: data.about
                    });
                }
            })
    }

    componentDidMount() {
        this.userData = new FormData()
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    isValid = () => {
        const { name, email, password, fileSize } = this.state;
        if (fileSize > 200000) {
            this.setState({ error: "File size should be less than 200 KB", loading: false });
            return false;
        }

        if (name.length === 0) {
            this.setState({ error: "Name is required", loading: false });
            return false;
        }
        //test regular expression with 'test' keyword
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({ error: "Please enter a valid email address.", loading: false });
            return false;
        }
        if (password.length >= 1 && password.length <= 5) {
            this.setState({ error: "Password must be at least 6 characters long", loading: false });
            return false;
        }
        return true;
    }

    handleChange = e => {
        const value = e.target.name === 'photo' ? e.target.files[0] : e.target.value;
        let fileSize;
        if(e.target.files[0]){
            fileSize = e.target.name === 'photo' ? e.target.files[0].size : 0;
        }

        this.userData.set(e.target.name, value);
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
            //const { name, email, password } = this.state;
            //const user = { name, email, password: password || undefined };
            // console.log(user);
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
            update(userId, token, this.userData)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error, loading: false });
                    } else {
                        updateUser(data, () => {    
                            this.setState({
                                redirectToProfile: true
                            });
                        })
                    }
                });
        }

    };

    signupForm = (name, email, password, loading, about) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Profile Photo</label>
                <input
                    onChange={this.handleChange}
                    name="photo"
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={this.handleChange}
                    name="name"
                    type="text"
                    className="form-control"
                    value={name}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={this.handleChange}
                    type="email"
                    name="email"
                    className="form-control"
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">About</label>
                <textarea
                    onChange={this.handleChange}
                    type="text"
                    name="about"
                    className="form-control"
                    value={about}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={this.handleChange}
                    type="password"
                    name="password"
                    className="form-control"
                    value={password}
                />
            </div>
            
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Update</button>
        </form>
    );

    render() {

        const { id, name, email, password, loading, redirectToProfile, error, about } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`}></Redirect>
        }
        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile ;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                <img 
                    style={{ display: loading ? "none" : "" , height: "200px", width: "auto" }} 
                    className="img-thumbnail" 
                    src={photoUrl} 
                    onError={i => (i.target.src = DefaultProfile)}
                    alt={name} 
                />
                {loading ? (
                    <Loading />
                ) : (
                    this.signupForm(name, email, password, loading, about)
                )}
            </div>
        );
    }
}

export default EditProfle;