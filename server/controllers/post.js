const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

const Post = require('../models/post');

exports.postById = (req, res, next, id) => {
    Post.findById(id)
    .populate("postedBy", "_id name")
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .select('_id title body created likes comments photo')
    .exec((err, post) => {
        if(err || !post){
            return res.status(400).json({
                error: err
            });
        }
        req.post = post;
        next();
    });
};

exports.getPosts = (req,res) => {
    const skip = req.query.skip;
    console.log(skip)
    const posts = Post.find()
    .skip(parseInt(skip))
    .limit(2)
    .populate("postedBy", "_id name")
    .populate('comments','text created')
    .populate('comments.postedBy','_id name')
    .select("_id title body created likes")
    .sort({created: -1})
    .then((posts) => {
        res.json(posts);
    })
    .catch(err => console.log(err));
};

exports.getAllPostsRn = (req,res) => {
    const posts = Post.find()
    .populate('comments.postedBy', '_id name updated')
    .populate('postedBy', '_id name updated')
    .select('_id title body created likes comments updated')
    .sort({created: -1})
    .then((posts) => {
        res.json(posts);
    })
    .catch(err => console.log(err));
    
}

exports.countPosts = (req,res) => {
    Post.count()
    .then((data) => {
        res.json({data})
    })
    .catch(err => console.log(err))
}

exports.createPost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    console.log(form);
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        let post = new Post(fields);
        console.log(fields);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;
        console.log(files);
        if(files.photo){
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if(err){
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
    });
};

exports.createPostRn = (req, res) => {
    let fields = {};
    fields.title = req.body.title;
    fields.body = req.body.body;
    let post = new Post(fields);
    console.log(fields);
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    post.postedBy = req.profile;
    post.photo.data = Buffer.from(req.body.base64Data, 'base64');
    post.photo.contentType = req.body.imageType;

    console.log(post);

    post.save((err, result) => {
        if(err){
            return res.status(400).json({
                error: err
            });
        }
        res.json(result);
    });
};


exports.getPostPhotoRn = (req,res) => {
    var base64 = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAAB3RJTUUH1QEHDxEhOnxCRgAAAAlwSFlzAAAK8AAACvABQqw0mAAAAXBJREFUeNrtV0FywzAIxJ3+K/pZyctKXqamji0htEik9qEHc3JkWC2LRPCS6Zh9HIy/AP4FwKf75iHEr6eU6Mt1WzIOFjFL7IFkYBx3zWBVkkeXAUCXwl1tvz2qdBLfJrzK7ixNUmVdTIAB8PMtxHgAsFNNkoExRKA+HocriOQAiC+1kShhACwSRGAEwPP96zYIoE8Pmph9qEWWKcCWRAfA/mkfJ0F6dSoA8KW3CRhn3ZHcW2is9VOsAgoqHblncAsyaCgcbqpUZQnWoGTcp/AnuwCoOUjhIvCvN59UBeoPZ/AYyLm3cWVAjxhpqREVaP0974iVwH51d4AVNaSC8TRNNYDQEFdlzDW9ob10YlvGQm0mQ+elSpcCCBtDgQD7cDFojdx7NIeHJkqi96cOGNkfZOroZsHtlPYoR7TOp3Vmfa5+49uoSSRyjfvc0A1kLx4KC6sNSeDieD1AWhrJLe0y+uy7b9GjP83l+m68AJ72AwSRPN5g7uwUAAAAAElFTkSuQmCC';
    var img = Buffer.from(base64, 'base64');

    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    res.end(img); 
}

exports.postsByUser = (req, res) => {
    Post.find({postedBy: req.profile._id})
    .populate("postedBy", "_id name")
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .select('_id title body created likes comments updated')
    .sort({created: -1})
    .exec((err, posts) => {
        if(err){
            return res.status(400).json({
                error: err
            });
        }
        res.json(posts)
    });
};

exports.isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id
    if(!isPoster){
        return res.status(403).json({
            error: "User is not authorized !"
        });
    }
    next();
};

// exports.updatePost = (req, res, next) => {
//     let post = req.post;
//     post = _.extend(post, req.body);
//     post.updated = Date.now();
//     post.save(err => {
//         if(err){
//             return res.status(400).json({
//                 error: err
//             });
//         }
//         res.json(post);
//     });
// };

exports.updatePost = (req,res,next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }
        //save post
        let post = req.post;
        post = _.extend(post, fields);
        post.updated = Date.now();
        
        if(files.photo){
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
        post.save((err, result) => {
            if(err){
                return res.status(400).json({
                    error: err
                })
            }
            res.json(post);
        });
    });
};


exports.updatePostRn = (req, res) => {
    let post = req.post;
    post = _.extend(post, req.body);

    post.updated = Date.now();

    if(req.body.base64Data && req.body.imageType){
        post.photo.data = Buffer.from(req.body.base64Data, 'base64');
        post.photo.contentType = req.body.imageType;
    }

    console.log("UPDATED POST ", post);

    post.save((err, result) => {
        if(err){
            return res.status(400).json({
                error: err
            });
        }
        res.json(result);
    });
}

exports.deletePost = (req, res) => {
    let post = req.post;
    post.remove((err, post) => {
        if(err){
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: "Successfully deleted the post"
        });
    });
};


exports.photo = (req, res, next) => {
    res.set("Content-Type", req.post.photo.contentType);
    return res.send(req.post.photo.data);
    next();
};

exports.singlePost = (req,res) => {
    return res.json(req.post);
}


exports.like = (req, res) => {
    // postId & userId comes from front end
    Post.findByIdAndUpdate(req.body.postId, { $push: {likes: req.body.userId} }, {new: true})
    .exec((err, result) => {
        if(err){
            return res.status(400).json({
                error: err
            })
        } else {
            res.json(result);
        }
    });
};

exports.unlike = (req, res) => {
    // postId & userId comes from front end
    Post.findByIdAndUpdate(req.body.postId, { $pull: {likes: req.body.userId} }, {new: true})
    .exec((err, result) => {
        if(err){
            return res.status(400).json({
                error: err
            })
        } else {
            res.json(result);
        }
    });
};


exports.comment = (req, res) => {
    //comment, postId and userId comes from frontend
    let comment = req.body.comment;
    comment.postedBy = req.body.userId
    Post.findByIdAndUpdate(req.body.postId, { $push: {comments: comment} }, {new: true})
    .populate('comments.postedBy','_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
        if(err){
            return res.status(400).json({
                error: err
            })
        } else {
            res.json(result);
        }
    });
};


exports.uncomment = (req, res) => {
    //comment, postId and userId comes from frontend
    let comment = req.body.comment;
    Post.findByIdAndUpdate(req.body.postId, { $pull: {comments: {_id: comment._id}} }, {new: true})
    .populate('comments.postedBy','_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
        if(err){
            return res.status(400).json({
                error: err
            })
        } else {
            res.json(result);
        }
    });
};