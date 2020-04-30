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