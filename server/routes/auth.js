const express = require('express')
const { signup, signin, signout } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const {userSignupValidator} = require('../validator/index');

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

// any route containing :userId, this is execute first
router.param("userId", userById);

module.exports = router;