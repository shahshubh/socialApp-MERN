import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './loading.css';

class Signin extends Component {
    constructor(){
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false
        }
    }

    handleChange = e => {
        this.setState({
            error: "",
            [e.target.name]: e.target.value
        });
    };

    authenticate(jwt, callback){
        if(typeof window !== "undefined"){
            localStorage.setItem("jwt", JSON.stringify(jwt))
            callback();
        }
    }

    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true });
        const { email, password } = this.state;
        const user = { email, password };
        // console.log(user);
        this.signin(user)
            .then(data => {
                if(data.error){
                    this.setState({error: data.error, loading: false });
                } else {
                    // authenticate
                    this.authenticate(data, () => {
                        this.setState({ redirectToReferer: true })
                    });
                }
            });
    };

    signin = (user) => {
        return fetch("http://localhost:8080/signin", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err));
    }

    signinForm = (email, password,loading) => (
        <form style={{ display: loading ? "none" : "" }} >
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
    )
    
    render(){

        const { email, password, error, redirectToReferer, loading } = this.state;
        if(redirectToReferer){
            return <Redirect to="/" />
        }
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Sign In</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                {this.signinForm(email, password,loading)}

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

export default Signin;