const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    cartItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    cartOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartTotal: {
        type: Number,
    }
}, { timestamps: true});

module.exports = mongoose.model("Cart", CartSchema);