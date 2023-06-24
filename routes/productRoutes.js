const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, getProduct, updateProduct, deleteProduct } = require('../controller/productController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/', getAllProducts);

router.get('/:id', getProduct);

router.post('/create', verifyJWT, createProduct);

router.put('/update/:id', verifyJWT, updateProduct);

router.delete('/delete/:id', verifyJWT, deleteProduct);


module.exports = router;