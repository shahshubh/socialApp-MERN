import React, { Component } from 'react';
import { follow, unfollow } from './apiUser';

class FollowProfileButton extends Component{

    followClick = () => {
        this.props.onButtonClick(follow);
    };

    unfollowClick = () => {
        this.props.onButtonClick(unfollow);
    };

    render(){
        return(
            <>
                { !this.props.following ? 
                    (
                        <button onClick={this.followClick} className="btn btn-success btn-raised">Follow</button>
                    ) : (
                        <button onClick={this.unfollowClick} className="btn btn-sm btn-danger pull-right">UnFollow</button>
                    )
                } 
            </>
        );
    }
}

export default FollowProfileButton;