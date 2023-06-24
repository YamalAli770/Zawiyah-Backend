const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const { getAllBids, createBid, getBid, updateBid, deleteBid } = require('../controller/bidController');

router.get('/', getAllBids);

router.get('/:id', getBid);

router.post('/create', verifyJWT, createBid);

router.put('/update/:id', verifyJWT, updateBid);

router.delete('/delete/:id', verifyJWT, deleteBid);

module.exports = router;