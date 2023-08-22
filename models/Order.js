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
    orderDetails: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        apartment: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            length: 11,
        },
        deliveryMethod: {
            type: String,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
    },
    orderStatus: {
        type: String,
        default: 'Order Placed'
    },
    orderPlacedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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