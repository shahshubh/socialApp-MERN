import React, { Component } from 'react';

import { findPeople, follow } from './apiUser';
import DefaultProfile from '../images/avatar.jpg';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/index';

import Loading from '../loading/Loading';

class FindPeople extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            error: "",
            open: false,
            followMessage: "",
            loading: false
        }
    }

    componentDidMount() {
        this.setState({loading: true})
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        findPeople(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ users: data, loading: false });
                }
            })
    }

    clickFollow = (user, i) => {
        this.setState({loading: true})
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        follow(userId, token, user._id)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                } else {
                    let toFollow = this.state.users;
                    toFollow.splice(i, 1);
                    this.setState({
                        users: toFollow,
                        open: true,
                        followMessage: `Following ${user.name}`,
                        loading: false
                    })
                }
            })
    };

    renderUsers = (users) => (
        <div className="row">
            {users.map((user, i) => (
                <div key={i} className="card col-md-3" style={{ padding: "0", margin: "15px"}} >
                    <img 
                        style={{  }}
                        height= "250"
                        width= "250"
                        className="card-img-top"
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                        onError={i => (i.target.src = DefaultProfile)}
                        alt={user.name}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                    </div>
                    <div className="card-body">
                        <Link
                            to={`/user/${user._id}`}
                            className="card-link btn btn-raised btn-primary">
                            View Profile
                        </Link>
                        <button style={{ 
                                        background: "#56ccf2", 
                                        background: "-webkit-linear-gradient(to left, #56ccf2, #2f80ed)",
                                        background: "linear-gradient(to left, #56ccf2, #2f80ed)",
                                        padding: "10px"
                                    }} onClick={() => this.clickFollow(user, i)} className="btn btn-raised btn-success pull-right">
                            Follow
                        </button>
                    </div>
                </div>
            ))}
        </div>

            );

    render(){
        const {users, open, followMessage, loading} = this.state;
        return(
            <div className="container">
                <h2 className="mt-5 mb-5">Find People</h2>
                {open && (
                    <div className="alert alert-success text-center">
                        {followMessage}
                    </div>
                )}
                {loading ? (
                    <Loading />
                ) : (
                    this.renderUsers(users)
                )}
            </div>
        );
    }
}

export default FindPeople;