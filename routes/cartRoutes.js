const express = require('express');
const router = express.Router();
const { getCartByUserId, addItemToCart, removeItemFromCart, clearCart, getAllCarts } = require('../controller/cartController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyAdmin = require('../middleware/verifyAdmin');

// ! Admin Routes

router.get('/', verifyAdmin, getAllCarts);

// ! User Routes

router.get('/:id', verifyJWT, getCartByUserId);

router.post('/add', verifyJWT, addItemToCart);

router.delete('/remove', verifyJWT, removeItemFromCart);

router.delete('/clear/:username', verifyJWT, clearCart);


module.exports = router;