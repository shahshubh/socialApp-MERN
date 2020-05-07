import React, { Component } from 'react';

import { signup } from "../auth";

import { Link } from 'react-router-dom';
import Loading from '../loading/Loading';

class Signup extends Component {
    constructor(){
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false,
            loading: false,
            recaptcha: false
        }
    }

    recaptchaHandler = e => {
        this.setState({ error: "" });
        let userDay = e.target.value.toLowerCase();
        let dayCount;

        if (userDay === "sunday") {
            dayCount = 0;
        } else if (userDay === "monday") {
            dayCount = 1;
        } else if (userDay === "tuesday") {
            dayCount = 2;
        } else if (userDay === "wednesday") {
            dayCount = 3;
        } else if (userDay === "thursday") {
            dayCount = 4;
        } else if (userDay === "friday") {
            dayCount = 5;
        } else if (userDay === "saturday") {
            dayCount = 6;
        }

        if (dayCount === new Date().getDay()) {
            this.setState({ recaptcha: true });
            return true;
        } else {
            this.setState({
                recaptcha: false
            });
            return false;
        }
    };


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
        if (this.state.recaptcha) {
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
        } else {
            this.setState({
                loading: false,
                error: "What day is today? Please write a correct answer!"
            });
        }
        
    };


    signupForm = (name, email, password, loading, recaptcha) => (
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
            <div className="form-group">
                <label className="text-muted">
                    {recaptcha ? "Captcha success. You got it!" : "What day is today?"}
                </label>
                <input
                    onChange={this.recaptchaHandler}
                    type="text"
                    className="form-control"
                />
            </div>
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
        </form>
    );


    render(){
        const { name, email, password, error, open, loading, recaptcha } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Signup</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                <div className="alert alert-info" style={{ display: open ? "" : "none" }}>
                    New account is successfully created. Please <Link to='/signin'>Sign In</Link>.
                </div>
                {this.signupForm(name, email, password, loading, recaptcha)}
                { loading ? (
                    <Loading />
                ) : (
                    ""
                )}
            </div>
        );
    }
}

export default Signup;