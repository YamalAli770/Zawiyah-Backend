const express = require('express');
const router = express.Router();
const { getCartByUserId, getCartProducts, addItemToCart, removeItemFromCart, clearCart } = require('../controller/cartController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/:id', verifyJWT, getCartByUserId);

router.get('/products/:id', verifyJWT, getCartProducts);

router.post('/add', verifyJWT, addItemToCart);

router.delete('/remove', verifyJWT, removeItemFromCart);

router.delete('/clear/:username', verifyJWT, clearCart);

module.exports = router;