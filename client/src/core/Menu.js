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
    <nav class="navbar navbar-expand-lg navbar-light bg-light"  
        style={{ 
            background: "#007991", 
            background: "-webkit-linear-gradient(to top, #007991, #78ffd6)",
            background: "linear-gradient(to top, #007991, #78ffd6)",
            paddingTop: "15px",
            paddingBottom: "0"
        }}
    >
        <a class="navbar-brand" style={{ color: "white" }} href="/">SocialApp</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse " id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
            <li className="nav-item ">
                <Link className="nav-link" style={isActive(props.history, "/")} to='/' >Home</Link>
            </li>
            {!isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(props.history, "/users")} to='/users' >Users</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(props.history, "/signin")} to='/signin' >Sign In</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(props.history, "/signup")} to='/signup' >Sign Up</Link>
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
                            Find People
                        </Link>
                    </li> 

                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to={'/post/create'}
                            style={isActive(props.history, '/post/create')}
                        >
                            Create Post
                        </Link>
                    </li> 
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to={`/chats/${isAuthenticated().user._id}`}
                            style={isActive(props.history, `/chats/${isAuthenticated().user._id}`)}
                        >
                            Chats
                        </Link>
                    </li>
                    <li className="nav-item">
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
                    </li>
                </>
            )}
        </ul>
        </div>
    </nav>    
);

export default withRouter(Menu);
