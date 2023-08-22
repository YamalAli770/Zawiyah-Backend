const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Bid = require('../models/Bid');
const Cart = require('../models/Cart');

const { getAllUsers, getMe, getUserByUsername } = require('../controller/userController');

const verifyAdmin = require('../middleware/verifyAdmin');

// Me
router.get('/me/:id', getMe);

// Get User By Username
router.get('/:username', getUserByUsername);

// ! Admin Routes

// Get All Users
router.get('/', verifyAdmin, getAllUsers);

module.exports = router;