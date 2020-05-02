import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { signout, isAuthenticated } from "../auth/Index";

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { color: "#ff9900" }
    } else {
        return { color: "#ffffff" }
    }
}

const Menu = (props) => (
    <div>
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link className="nav-link" style={isActive(props.history, "/")} to='/' >Home</Link>
            </li>

            {!isAuthenticated() && (
                <>
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
                        <a
                            className="nav-link"
                            style={isActive(props.history, "/signup"), { cursor: "pointer", color: "#fff" }}
                            onClick={() => signout(() => props.history.push('/'))}
                        >
                            Sign Out
                        </a>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            to={`/user/${isAuthenticated().user._id}`}
                        >
                            {`${isAuthenticated().user.name}'s profile`}
                        </Link>
                    </li> 
                </>
            )}
        </ul>
    </div>
);

export default withRouter(Menu);
