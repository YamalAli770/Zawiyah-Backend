const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const{ registerUser, loginUser, logoutUser, refreshAccessToken, loginAdmin } = require('../controller/authController');

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Logout
router.get('/logout', logoutUser);

// Refresh Access Token
router.get('/refresh-token', refreshAccessToken);

// ! Admin Routes

router.post('/admin', loginAdmin);

module.exports = router;