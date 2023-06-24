const express = require('express');
const router = express.Router();
const { getCartByUserId, addItemToCart, removeItemFromCart, clearCart } = require('../controller/cartController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/:id', verifyJWT, getCartByUserId);

router.post('/add', verifyJWT, addItemToCart);

router.get('/remove', verifyJWT, removeItemFromCart);

router.get('/clear/:username', verifyJWT, clearCart);

module.exports = router;