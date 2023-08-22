const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        required: true,
        default: 'buyer'
    },
    productsListedToSell: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    productsBidOn: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    placedOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    refreshToken: {
        type: String,
    },
    isAdmin: {
        type: String,
        default: false
    }
}, { timestamps: true });

UserSchema.statics.verifyId = function (id, req, res) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("The Id Provided Is Not Valid");
    }
};

module.exports = mongoose.model("User", UserSchema);