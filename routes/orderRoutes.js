const express = require('express');
const router = express.Router();

const { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } = require('../controller/orderController');

const verifyJWT = require('../middleware/verifyJWT');

router.get('/', verifyJWT, getAllOrders);

router.get('/:id', verifyJWT, getOrderById);

router.post('/create', verifyJWT, createOrder);

router.put('/update', verifyJWT, updateOrder);

router.delete('/delete', verifyJWT, deleteOrder);

module.exports = router;