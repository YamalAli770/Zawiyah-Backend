const express = require('express');
const router = express.Router();

const{ registerUser, loginUser, logoutUser } = require('../controller/authController');

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Logout
router.get('/logout', logoutUser);

module.exports = router;