const express = require('express');
const requestsController = require('../Controllers/requestsController'); // Make sure the path and filename are correct
const authController = require('../Controllers/authController');

const router = express.Router();

// Public route for getting products by name (available to anyone)

// Route for adding products, restricted to admin only
router.post('/addRequest', authController.protect, requestsController.addRequest);
router.get('/getRequests', authController.protect, requestsController.getRequests);
router.get('/myRequests', authController.protect, requestsController.myRequests);

router.delete('/deleteRequest/:id', authController.protect, requestsController.deleteRequest);

module.exports = router;
