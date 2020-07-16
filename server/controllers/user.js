const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');

const User = require('../models/user');

exports.userById = (req, res, next, id) => {
    User.findById(id)
    .populate('following','_id name')
    .populate('followers','_id name')
    .select('name email created about following followers')
    .exec((err, user) => {
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
        return res.json(users);
    })
    .select("name email updated created about following followers notificationToken")
    .populate('following','_id name email')
    .populate('followers','_id name email');
};

exports.getUser = (req, res) => {
    // set hashed_password and salt undefined since we dont want it in response while viewing single user
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

// exports.updateUser = (req, res, next) => {
//     let user = req.profile;
//     // extend method from lodash => mutates the source object
//     user = _.extend(user, req.body);
//     user.updated = Date.now();
//     user.save((err) => {
//         if(err){
//             return res.status(400).json({
//                 error: "You are not authorized to perform this action !!"
//             });
//         }
//         user.hashed_password = undefined;
//         user.salt = undefined;
//         res.json({user})
//     });
// };

exports.updateUser = (req,res,next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }
        //save user
        let user = req.profile;
        user = _.extend(user, fields);
        user.updated = Date.now();
        
        if(files.photo){
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }
        user.save((err, result) => {
            if(err){
                return res.status(400).json({
                    error: err
                })
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        });
    });
};


exports.updateUserRn = (req,res) => {
    let user = req.profile;
    console.log(req.body);
    user = _.extend(user, req.body);

    user.updated = Date.now();

    if(req.body.base64Data && req.body.imageType){
        user.photo.data = Buffer.from(req.body.base64Data, 'base64');
        user.photo.contentType = req.body.imageType;
    }

    user.save((err, result) => {
        if(err){
            return res.status(400).json({
                error: err
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
    });
};

exports.userPhoto = (req, res, next) => {
    User.findById(req.params.userId, (err, user) => {
        if(err || !user){
            res.status(400).json({
                error: err
            })
        }
        if(user.photo.data){
            res.set("Content-Type", user.photo.contentType);
            return res.send(user.photo.data);
        }
        next();
    })
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



//Follow and unfollow
exports.addFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId, {$push: { following: req.body.followId }}, (err, result) => {
        if(err){
            return res.status(400).json({error: err});
        }
        next();
    });
};

exports.addFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {$push: { followers: req.body.userId }}, {new: true})
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, result) => {
        if(err){
            return res.status(400).json({error: err})
        }
        result.hashed_password = undefined;
        result.salt = undefined;
        res.json(result);
    });
};


exports.removeFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId, {$pull: { following: req.body.unfollowId }}, (err, result) => {
        if(err){
            return res.status(400).json({error: err});
        }
        next();
    });
};

exports.removeFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {$pull: { followers: req.body.userId }}, {new: true})
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, result) => {
        if(err){
            return res.status(400).json({error: err})
        }
        result.hashed_password = undefined;
        result.salt = undefined;
        res.json(result);
    });
};


exports.findPeople = (req, res) => {
    let following = req.profile.following;
    following.push(req.profile._id);
    User.find({_id: {$nin: following}}, (err, users) => {
        if(err){
            return res.status(400).json({
                error: err
            })
        }
        res.json(users);
    })
    .select("name email");
};