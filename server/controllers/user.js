const _ = require('lodash');

const User = require('../models/user');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "User not found"
            });
        }
        // add profile object in request with user info
        req.profile = user ;
        next();
    });
};

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && (req.profile._id === req.auth._id);
    if(!authorized){
        return res.status(403).json({
            error: "user is not authorized to perform this action"
        });
    }
};

exports.allUsers = (req,res) => {
    User.find((err, users) => {
        if(err){
            res.status(400).json({
                error: err
            });
        }
        return res.json({ users });
    }).select("name email updated created");
};

exports.getUser = (req, res) => {
    // set hashed_password and salt undefined since we dont want it in response while viewing single user
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
    let user = req.profile;
    // extend method from lodash => mutates the source object
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.save((err) => {
        if(err){
            return res.status(400).json({
                error: "You are not authorized to perform this action !!"
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({user})
    });
};

exports.deleteUser = (req, res, next) => {
    let user = req.profile;
    user.remove((err, user) => {
        if(err){
            return res.status(400).json({
                error: err
            });
        }
        res.json({ message: "User deleted successfully" });
    });
};