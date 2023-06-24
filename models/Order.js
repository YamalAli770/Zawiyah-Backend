const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    orderProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    }],
    orderTotal: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'pending'
    },
    orderPlacedBy: {
        type: String,
        required: true,
    },
}, { timestamps: true });

OrderSchema.statics.verifyId = function (id, req, res) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("The Id Provided Is Not Valid");
    }
};

module.exports = mongoose.model("Order", OrderSchema);