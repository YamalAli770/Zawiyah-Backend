const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");

// Get All Carts
const getAllCarts = asyncHandler(async (req, res) => {
  const carts = await Cart.find({}).populate('cartItems');

  if(!carts) {
    res.status(404);
    throw new Error("Carts not found");
  };
  
  res.json(carts);
});

// Get cart by user ID
const getCartByUserId = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const cart = await Cart.findOne({ cartOwner: id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const cartProducts = await Product.find({_id: {$in: cart.cartItems}});

  if(!cartProducts) {
    res.status(404);
    throw new Error("Cart products not found");
  };

  cart.cartItems = cartProducts;

  res.status(200).json(cart);
});

// Add item to cart
const addItemToCart = asyncHandler(async (req, res) => {
  const { id, productId } = req.body;

  if(!id || !productId) {
    res.status(400);
    throw new Error("The required information aren't provided.")
  }

  Product.verifyId(productId);

  const cart = await Cart.findOne({ cartOwner: id });

  // Check if the product is already in the cart
  if (cart.cartItems.includes(productId)) {
    res.status(409);
    throw new Error("Product already in cart");
  }

  // Add the product to the existing cart
  cart.cartItems.push(productId);
  const cartTotal = await calculateCartTotal(cart.cartItems);
  cart.cartTotal = cartTotal;
  await cart.save();
    
  const cartProducts = await Product.find({_id: {$in: cart.cartItems}});

  if(!cartProducts) {
    res.status(404);
    throw new Error("Cart products not found");
  };

  cart.cartItems = cartProducts;

  res.json(cart);
});

// Remove item from cart
const removeItemFromCart = asyncHandler(async (req, res) => {
  const { id, productId } = req.body;
  console.log(id, productId);

  Product.verifyId(productId);

  const cart = await Cart.findOne({ cartOwner: id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const index = cart.cartItems.indexOf(productId);
  if (index > -1) {
    cart.cartItems.splice(index, 1);
    await cart.save();
  }

  const updatedCart = await Cart.findOne({ cartOwner: id });

  const cartTotal = await calculateCartTotal(updatedCart.cartItems);

  updatedCart.cartTotal = cartTotal;
  await updatedCart.save();

  const cartProducts = await Product.find({_id: {$in: cart.cartItems}});

  if(!cartProducts) {
    res.status(404);
    throw new Error("Cart products not found");
  };

  updatedCart.cartItems = cartProducts;

  res.json(updatedCart);
});

// Clear cart
const clearCart = asyncHandler(async (req, res) => {
  const username = req.params.username;

  const user = await User.findOne({ username });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const id = user._id;

  const cart = await Cart.findOne({ cartOwner: id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.cartItems = [];
  cart.cartTotal = 0;
  await cart.save();

  res.json(cart);
});

const calculateCartTotal = async (cartItems) => {
  let total = 0;

  if (!cartItems) return total;

  const products = await Product.find({ _id: { $in: cartItems } });

  products.forEach((product) => {
    total += product.price;
  });

  return total;
};

module.exports = {
  getCartByUserId,
  addItemToCart,
  removeItemFromCart,
  clearCart,
  getAllCarts
};
