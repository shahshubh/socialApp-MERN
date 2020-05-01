import React, { Component } from 'react';

class Signup extends Component {
    constructor(){
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: ""
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    clickSubmit = e => {
        e.preventDefault();
        const { name, email, password } = this.state;
        const user = { name, email, password };
        // console.log(user);
        this.signup(user)
        .then(data => {
            if(data.error){
                this.setState({error: data.error});
            } else {
                this.setState({
                    name: "",
                    email: "",
                    password: "",
                    error: ""
                });
            }
        });
    };

    signup = (user) => {
        return fetch("http://localhost:8080/signup", {
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

    render(){
        const { name, email, password } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Signup</h2>
                <form>
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
            </div>
        );
    }
}

export default Signup;