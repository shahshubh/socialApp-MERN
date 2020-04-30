const express = require('express')

const { requireSignin } = require('../controllers/auth');
const { getPosts, createPosts } = require('../controllers/post')
const { userById } = require('../controllers/user');
const {createPostValidator} = require('../validator/index');

const router = express.Router();

router.get('/', getPosts );
router.post("/post", requireSignin, createPostValidator, createPosts);

// any route containing :userId, this is execute first
router.param("userId", userById);

module.exports = router;