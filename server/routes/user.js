const express = require('express')
const { userById, allUsers } = require('../controllers/user');

const router = express.Router();

router.get("/users", allUsers);

// any route containing :userId, this is execute first
router.param("userId", userById);

module.exports = router;