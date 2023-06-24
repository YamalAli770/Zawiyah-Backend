const express = require('express');
const router = express.Router();

const { getAllUsers, getMe, getUserByUsername } = require('../controller/userController');

// Get All Users
router.get('/', getAllUsers);

// Me
router.get('/me/:id', getMe);

// Get User By Username
router.get('/:username', getUserByUsername);

module.exports = router;