const Bid = require('../models/Bid');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { getIO } = require("../config/socket");

// Get all bids
const getAllBids = asyncHandler(async (req, res) => {
    const bids = await Bid.find();
    res.json(bids);
});

// Get a single bid by ID
const getBid = asyncHandler(async (req, res) => {
    const id = req.params.id;

    Bid.verifyId(id);
    const bid = await Bid.findById(id);
    
    if(!bid) {
        res.status(404);
        throw new Error("Bid Not Found");
    }

    req.json(bid);
});

// Create a new bid
const createBid = asyncHandler(async (req, res) => {
    const io = getIO();
    const { username, accountType } = req.user;
    const { bidAmount, bidOn } = req.body;

    if(accountType === "seller" || accountType == "Seller" ) {
        res.status(401);
        throw new Error("Seller Cannot Bid On Products");
    };

    const user = await User.findOne({ username });
    Product.verifyId(bidOn);

    
    const product = await Product.findById(bidOn);

    if(!product) {
        res.status(404);
        throw new Error("Product Not Found");
    }

    // Check if bidding time is valid
    if(!isBiddingTimeValid(product)) {
        res.status(400);
        throw new Error("Bidding Time Is Over");
    };

    // Check if bid amount is greater than current price
    if(bidAmount <= product.price) {
        res.status(400);
        throw new Error("Bid Amount Should Be Greater Than Current Price");
    }

    // Check if user already has a bid on the product
    const existingBid = await Bid.findOne({ bidOn: product._id, bidBy: user._id });

    if (existingBid) {
        // Update the existing bid amount
        existingBid.bidAmount = bidAmount;
        await existingBid.save();

        product.price = bidAmount;
        await product.save();

        io.emit("newBid", { bid: existingBid });

        res.status(200).json(existingBid);
    } else {
        // Create a new bid
        const bid = await Bid.create({
            bidAmount,
            bidBy: user._id,
            bidOn: product._id
        });

        await bid.save();

        product.price = bidAmount;

        user.productsBidOn.push(product._id);

        await user.save();
        await product.save();

        io.emit("newBid", { bid });

        res.status(200).json(bid);
    }
});

// Update a bid
const updateBid = asyncHandler(async (req, res) => {
    const bidId = req.params.id;
    const { bidAmount } = req.body;
    
    Bid.verifyId(bidId);
    
    const bid = await Bid.findById(bidId);
    
    if(!bid) {
        res.status(404);
        throw new Error("Bid Not Found");
    }
    
    const product = await Product.findById(bid.bidOn);
    
    // Check if bidding time is valid
    if(!isBiddingTimeValid(product)) {
        res.status(400);
        throw new Error("Bidding Time Is Over");
    }
    
    // Check if bid amount is greater than current price
    if(bidAmount <= product.price) {
        res.status(400);
        throw new Error("Bid Amount Should Be Greater Than Current Price");
    }
    
    bid.bidAmount = bidAmount;
    await bid.save();
    
    product.price = bidAmount;
    await product.save();
    
    res.status(200).json(bid);
});

// Delete a bid
const deleteBid = asyncHandler(async (req, res) => {
    const id = req.params.id;
    
    Bid.verifyId(id);
    const bid = await Bid.findById(id);
    
    if(!bid) {
        res.status(404);
        throw new Error("Bid Not Found");
    }
    
    await Bid.deleteOne(bid);
    
    res.send("Bid Deleted Successfully");
});

const deleteAllBids = asyncHandler(async (req, res) => {
    const bids = await Bid.deleteMany({});
    res.json(bids);
});

function isBiddingTimeValid(product) {
    const currentTime = new Date();
    const biddingEndTime = product.createdAt.getTime() + (1 * 24 * 60 * 60 * 1000);
    return currentTime <= biddingEndTime;
}

const getHighestBidOnProduct = asyncHandler(async(req, res) => {
    const productId = req.params.id;

    Product.verifyId(productId);
    const product = await Product.findById(productId);

    if(!product) {
        res.status(404);
        throw new Error("Product Not Found");
    }

    if(isBiddingTimeValid(product)) {
        res.status(400);
        throw new Error("Bidding Time Isn't Over Yet");
    };

    const bid = await Bid.findOne({ bidOn: productId }).sort({ bidAmount: -1 });

    if(!bid) {
        res.status(404);
        throw new Error("No Bids Found");
    }

    res.status(200).json(bid);
});

module.exports = {
    getAllBids,
    getBid,
    createBid,
    updateBid,
    deleteBid,
    deleteAllBids,
    getHighestBidOnProduct
}