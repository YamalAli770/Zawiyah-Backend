const express = require('express');
const router = express.Router();

const { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } = require('../controller/orderController');

const verifyJWT = require('../middleware/verifyJWT');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/:id', verifyJWT, getOrderById);

router.post('/create', verifyJWT, createOrder);

// ! Admin Routes

router.get('/', verifyAdmin, getAllOrders);

router.put('/update', verifyAdmin, updateOrder);

router.delete('/delete', verifyAdmin, deleteOrder);

module.exports = router;