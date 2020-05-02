import React, { Component } from 'react';

import { signup } from "../auth/Index";

import './loading.css';

class Signup extends Component {
    constructor(){
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false,
            loading: false
        }
    }

    handleChange = e => {
        this.setState({
            error: "",
            open: false,
            [e.target.name]: e.target.value
        });
    };

    clickSubmit = e => {
        e.preventDefault();
        this.setState({loading: true})
        const { name, email, password } = this.state;
        const user = { name, email, password };
        // console.log(user);
        signup(user)
        .then(data => {
            if(data.error){
                this.setState({error: data.error, loading: false});
            } else {
                this.setState({
                    name: "",
                    email: "",
                    password: "",
                    error: "",
                    open: true,
                    loading: false
                });
            }
        });
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
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
        </form>
    );


    render(){
        const { name, email, password, error, open, loading } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Signup</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                <div className="alert alert-info" style={{ display: open ? "" : "none" }}>
                    New account is successfully created. Please signin.
                </div>
                {this.signupForm(name, email, password, loading)}
                { loading ? (
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

export default Signup;