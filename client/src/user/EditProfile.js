import React, { Component } from 'react';

import { read, update } from "./apiUser";
import { isAuthenticated } from "../auth";
import './loading.css';
import { Redirect } from 'react-router-dom';



class EditProfle extends Component {

    constructor() {
        super();
        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            loading: false,
            redirectToProfile: false,
            error: ""
        }
    }

    init = (userId) => {
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToProfile: true })
                } else {
                    this.setState({ id: data._id, name: data.name, email: data.email, error: "" });
                }
            })
    }

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    isValid = () => {
        const { name, email, password } = this.state;
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
        this.setState({
            error: "",
            [e.target.name]: e.target.value
        });
    };

    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true })
        if (this.isValid()) {
            const { name, email, password } = this.state;
            const user = { name, email, password: password || undefined };
            // console.log(user);
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
            update(userId, token, user)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error, loading: false });
                    } else {
                        this.setState({
                            redirectToProfile: true
                        });
                    }
                });
        }

    };

    signupForm = (name, email, password, loading) => (
        <form style={{ display: loading ? "none" : "" }}>
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

        const { id, name, email, password, loading, redirectToProfile, error } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`}></Redirect>
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                {this.signupForm(name, email, password, loading)}
                {loading ? (
                    <div className="loader">
                        <h1>LOADING</h1>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                ) : (
                        ""
                    )}
            </div>
        );
    }
}

export default EditProfle;