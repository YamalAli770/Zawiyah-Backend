const mongoose = require('mongoose');

const BidSchema = mongoose.Schema({
    bidAmount: {
        type: Number,
        required: true,
    },
    bidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bidOn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, { timestamps: true });

BidSchema.statics.verifyId = function (id, req, res) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("The Id Provided Is Not Valid");
    }
};

module.exports = mongoose.model("Bid", BidSchema);