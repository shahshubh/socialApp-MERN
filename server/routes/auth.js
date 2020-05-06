const express = require('express')
const { signup, signin, signout, forgotPassword, resetPassword } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const {userSignupValidator, passwordResetValidator} = require('../validator/index');

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

// password forgot and reset routes
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);


// any route containing :userId, this is execute first
router.param("userId", userById);

module.exports = router;