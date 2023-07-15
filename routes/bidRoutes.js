const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const { getAllBids, createBid, getBid, getHighestBidOnProduct, updateBid, deleteBid, deleteAllBids } = require('../controller/bidController');

router.get('/', getAllBids);

router.get('/:id', getBid);

router.post('/create', verifyJWT, createBid);

router.get('/highest/:id', verifyJWT, getHighestBidOnProduct);

router.put('/update/:id', verifyJWT, updateBid);

router.delete('/delete/:id', verifyJWT, deleteBid);

router.get('/delete/all', verifyJWT, deleteAllBids);

module.exports = router;