const Product = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// Get a single product by ID
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  Product.verifyId(id);

  const product = await Product.findById(id);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  res.json(product);
});

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
  const { username, accountType } = req.user;

  const { name, brand, category, description, initialPrice } = req.body;

  if(accountType !== "seller" && accountType !== "Seller") {
    res.status(403).json({ message: "You are not authorized to create a product" });
    return;
  };

  if (!name || !brand || !category || !description || !initialPrice ) {
    res.status(400).json({ message: "Provide all required fields." });
    return;
  };

  if (!req.files || !req.files.image) {
    res.status(400).json({ message: "Image file is required" });
    return;
  }

  const image = req.files.image;

  // Check if the file is in PNG or JPG format
  if (!['image/png', 'image/jpeg'].includes(image.mimetype)) {
    res.status(400).json({ message: "Only PNG and JPG images are allowed" });
    return;
  }

  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileExtension = image.name.split('.').pop();
  const newFileName = `${timestamp}-${randomString}.${fileExtension}`;
  const imagePath = `public/uploads/${newFileName}`;

  // Move the uploaded file to the specified path
  try {
    await image.mv(imagePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload image" });
    return;
  }

  const user = await User.findOne({ username: username });

  const product = await Product.create({
    name,
    brand,
    category,
    initialPrice,
    description,
    currentPrice: initialPrice,
    image: imagePath,
    productListedBy: user._id,
    ...req.body,
  });

  await product.save();

  user.productsListedToSell.push(product._id);

  await user.save();

  res.status(201).json(product);
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { accountType } = req.user;

  const id = req.params.id;

  if(accountType !== "seller") {
    res.status(403).json({ message: "You are not authorized to modify a product" });
    return;
  };
  
  if(Object.keys(req.body).length === 0) {
    res.status(400);
    throw new Error("The field to be updated must be provided");
  }
  
  Product.verifyId(id);

  const product = await Product.findById(id);

  if (!product) {
    res.status(400);
    throw new Error("Cannot Find Product With The Given Id")
  }

  product.$set(req.body);
  const updatedProduct = await product.save()

  res.status(200).json(updatedProduct)
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { accountType } = req.user;

  const id = req.params.id;

  if(accountType !== "seller" || accountType !== "Seller") {
    res.status(403).json({ message: "You are not authorized to delete a product" });
    return;
  };
  
  Product.verifyId(id);

  const product = await Product.findById(id);

  if (!product) {
    res.status(400);
    throw new Error("Cannot Find Product With The Given Id")
  }

  await Product.deleteOne(product);

  res.status(200).send("Product Deleted Successfully");
});

module.exports = {
  getProduct,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
