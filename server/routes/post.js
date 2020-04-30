const express = require('express')
const { getPosts, createPosts } = require('../controllers/post')
const validator = require('../validator/index');

const router = express.Router();

router.get('/', getPosts );
router.post("/post", validator.createPostValidator, createPosts);

module.exports = router;