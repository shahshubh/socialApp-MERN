const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');

const User = require('../models/user');


exports.signup = async (req,res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if(userExists) return res.status(403).json({ 
        error: "Email already taken!" 
    });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({ message: "Signup success! Please Login. " });
};

exports.signin = (req,res) => {
    // find user by email
    const {email,password} = req.body;
    User.findOne({email}, (err, user) => {
        // if error or no user found
        if(err || !user){
            return res.status(401).json({
                error: "User with that email does not exist. Please signup. "
            });
        }
        // if user is found => match the password by userschema methods authenticate
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password do not match"
            });
        }
        
        //generate token with user id and secret 
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET );
        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
        //return response with user and token to frontend client
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, email, name }});
    });
}

exports.signout = (req,res) => {
    res.clearCookie("t")
    return res.status(200).json({ message: "signout success! " })
}


exports.requireSignin = expressJwt({
    // if the token is valid, express jwt appends the verified users id
    // in an auth key to request object
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});
