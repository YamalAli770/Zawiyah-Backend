const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    initialPrice: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    productListedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

ProductSchema.statics.verifyId = function (id, req, res) {
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("The Id Provided Is Not Valid");
    }
};

module.exports = mongoose.model("Product", ProductSchema);