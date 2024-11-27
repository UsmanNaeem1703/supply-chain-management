const express = require('express');
const productController = require('../Controllers/productController'); // Make sure the path and filename are correct
const authController = require('../Controllers/authController');

const router = express.Router();

// Public route for getting products by name (available to anyone)
router.get('/name/:name', productController.getProductsByNamePattern);

// Route for adding products, restricted to admin only
router.post('/addProduct', authController.protect, authController.restrictTo('admin'), productController.addProduct);
router.patch('/updateProduct/:id', authController.protect, authController.restrictTo('admin'), productController.updateProduct);
router.delete('/deleteProduct/:id', authController.protect, authController.restrictTo('admin'), productController.deleteProduct);
router.get('/getProducts/:page', productController.getProducts);
router.get('/getProduct/:id', productController.getProduct);

module.exports = router;
