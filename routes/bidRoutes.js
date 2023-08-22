const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const verifyAdmin = require('../middleware/verifyAdmin');
const { getAllBids, createBid, getBid, getHighestBidOnProduct, updateBid, deleteBid, deleteAllBids } = require('../controller/bidController');


router.get('/:id', getBid);

router.post('/create', verifyJWT, createBid);

router.get('/highest/:id', verifyJWT, getHighestBidOnProduct);

// router.put('/update/:id', verifyJWT, updateBid);

// ! Admin Routes

router.get('/', verifyAdmin, getAllBids);

router.delete('/delete/:id', verifyAdmin, deleteBid);

router.get('/delete/all', verifyAdmin, deleteAllBids);

module.exports = router;