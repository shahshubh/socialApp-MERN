const express = require('express')

const { requireSignin } = require('../controllers/auth');
const { getPosts, createPost, postsByUser, postById, isPoster, deletePost, updatePost } = require('../controllers/post')
const { userById } = require('../controllers/user');
const {createPostValidator} = require('../validator/index');

const router = express.Router();

router.get('/', getPosts );
router.post("/post/new/:userId", requireSignin, createPost, createPostValidator);
router.get("/post/by/:userId", postsByUser);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);

// any route containing :userId, this is execute first
router.param("userId", userById);
// any route containing :postId, this is execute first
router.param("postId", postById);

module.exports = router;