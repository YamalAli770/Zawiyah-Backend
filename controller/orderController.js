const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');

// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
  });
  
  // Get order by ID
  const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    Order.verifyId(id, req, res);
  
    const order = await Order.findById(id);
  
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
  
    res.json(order);
  });
  
  // Create a new order
  const createOrder = asyncHandler(async (req, res) => {
    const { orderProducts, orderTotal, orderStatus, orderPlacedBy } = req.body;

    if(!orderProducts || orderProducts.length > 0 || !orderTotal || !orderStatus || !orderPlacedBy) {
        res.status(400);
        throw new Error("Please fill all required fields");
    };

    const user = await User.findOne({ username: orderPlacedBy });

    if(!user) {
        res.status(400);
        throw new Error("User not found");
    };
  
    const newOrder = await Order.create({
      orderProducts,
      orderTotal,
      orderStatus,
      orderPlacedBy,
    });
  
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
      throw new Error('Order not found');
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
      throw new Error('Order not found');
    }
  
    await Order.deleteOne(order);
  
    res.json({ message: 'Order removed' });
  });
  
  module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
  };