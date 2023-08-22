const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, getProduct, updateProduct, deleteProduct } = require('../controller/productController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyAdmin = require('../middleware/verifyAdmin')

router.get('/', getAllProducts);

router.get('/:id', getProduct);

router.post('/create', verifyJWT, createProduct);

// ! Admin Routes

router.put('/update/:id', verifyAdmin, updateProduct);

router.delete('/delete/:id', verifyAdmin, deleteProduct);


module.exports = router;