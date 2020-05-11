import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { signout, isAuthenticated } from "../auth";

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { borderBottom: "4px solid #ff9900", color: "white" }
    } else {
        return { color: "#ffffff" }
    }
}

const Menu = (props) => (
    <nav class="navbar navbar-expand-lg navbar-light"  
        style={{ 
            background: "#007991", 
            paddingTop: "15px",
            paddingBottom: "0",
            marginBottom: "50px"

        }}
    >
        <a class="navbar-brand" style={{ color: "white", fontFamily: 'Courgette, cursive' }} href="/">
            <i class="fas fa-camera-retro mr-2"></i>SocialApp
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse " id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
            <li className="nav-item ">
                <Link className="nav-link" style={isActive(props.history, "/")} to='/' >
                <i class="fas fa-home mr-1"></i>Home
                </Link>
            </li>
            {!isAuthenticated() && (
                <>
                    {/* <li className="nav-item">
                        <Link className="nav-link" style={isActive(props.history, "/users")} to='/users' >
                        <i class="fas fa-users mr-1"></i>Users
                        </Link>
                    </li> */}
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(props.history, "/signin")} to='/signin' >
                        <i class="fas fa-sign-in-alt mr-1"></i>Sign In
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(props.history, "/signup")} to='/signup' >
                            <i class="fas fa-user-plus mr-1"></i>Sign Up
                        </Link>
                    </li>
                </>
            )}
            {isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to={'/findpeople'}
                            style={isActive(props.history, '/findpeople')}
                        >
                            <i class="fas fa-users mr-1"></i>Find People
                        </Link>
                    </li> 

                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to={'/post/create'}
                            style={isActive(props.history, '/post/create')}
                        >
                            <i class="fas fa-plus mr-1"></i>Create Post
                        </Link>
                    </li> 
                    <div class="dropdown">
                        <button style={{color: "#fff"}} class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-user-cog mr-1"></i>{`${isAuthenticated().user.name}'s profile`}
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <Link 
                                class="dropdown-item" 
                                to={`/user/${isAuthenticated().user._id}`}
                            >
                                <i class="fas fa-user mr-1"></i>Your Profile
                            </Link>
                            <Link
                                className="dropdown-item"
                                to={`/chats/${isAuthenticated().user._id}`}
                            >
                                <i class="fas fa-comment-alt mr-1"></i>Chats
                            </Link>
                            <span
                                className="dropdown-item"
                                style={{ cursor: "pointer" }}
                                onClick={() => signout(() => props.history.push('/'))}
                            >
                                <i class="fas fa-sign-out-alt mr-1"></i>Sign Out
                            </span>
                        </div>
                    </div>
                    {/* <li className="nav-item">
                        <Link
                            className="nav-link"
                            to={`/user/${isAuthenticated().user._id}`}
                            style={isActive(props.history, `/user/${isAuthenticated().user._id}`)}
                        >
                            {`${isAuthenticated().user.name}'s profile`}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <span
                            className="nav-link"
                            style={
                                (isActive(props.history, "/signup"),
                                { cursor: "pointer",color: "#fff" })
                            }
                            onClick={() => signout(() => props.history.push('/'))}
                        >
                            Sign Out
                        </span>
                    </li> */}
                </>
            )}
        </ul>
        </div>
    </nav>    
);

export default withRouter(Menu);
