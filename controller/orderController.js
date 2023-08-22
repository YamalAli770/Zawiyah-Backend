const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { default: mongoose } = require("mongoose");

// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('orderProducts');

  if(!orders || orders.length === 0) {
    res.status(404);
    throw new Error("No orders found");
  }

  res.json(orders);
});

// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  Order.verifyId(id, req, res);

  const order = await Order.findById(id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const orderProducts = await Product.find({
    _id: { $in: order.orderProducts },
  });

  order.orderProducts = orderProducts;

  res.status(200).json(order);
});

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const { orderProducts, orderTotal, orderDetails } = req.body;

  console.log(orderProducts, orderTotal, orderDetails);

  if (
    !orderProducts ||
    !orderProducts.length > 0 ||
    !orderTotal ||
    !orderDetails
  ) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const {
    address,
    apartment,
    city,
    country,
    state,
    postalCode,
    phoneNumber,
    deliveryMethod,
    paymentMethod,
  } = orderDetails;

  if (
    !address ||
    !city ||
    !country ||
    !state ||
    !postalCode ||
    !phoneNumber ||
    !deliveryMethod ||
    !paymentMethod
  ) {
    res.status(400);
    throw new Error("Please fill all delivery details");
  }

  const nonDigitRegex = /[^0-9]/g;

  if (
    postalCode.length !== 5 ||
    nonDigitRegex.test(postalCode) ||
    phoneNumber.length !== 11 ||
    nonDigitRegex.test(phoneNumber)
  ) {
    res.status(400);
    throw new Error("Please enter a valid postal code and phone number");
  }

  const user = await User.findOne({ _id: id });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (user.accountType.toLowerCase() !== "buyer") {
    res.status(403);
    throw new Error("You are not authorized to place an order");
  }

  const newOrder = await Order.create({
    orderProducts,
    orderTotal,
    orderDetails,
    orderPlacedBy: user._id,
  });

  await User.updateOne(
    { _id: user._id },
    { $push: { placedOrders: newOrder._id } }
  );

  await Product.updateMany({ _id: { $in: orderProducts } }, { isSold: true });

  await Cart.updateOne(
    { cartOwner: user._id },
    { $set: { cartItems: [], cartTotal: 0 } }
  );

  res.status(201).json(newOrder);
});

// Update an existing order
const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  Order.verifyId(id, req, res);

  const order = await Order.findById(id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = orderStatus;

  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

// Delete an order
const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  Order.verifyId(id, req, res);

  const order = await Order.findById(id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  await Order.deleteOne(order);

  res.json({ message: "Order removed" });
});

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
