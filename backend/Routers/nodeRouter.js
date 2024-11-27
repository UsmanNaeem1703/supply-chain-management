const express = require('express');
const nodeController = require('../Controllers/nodeController');
const authController = require('../Controllers/authController');

const router = express.Router();

// Public routes
router.post('/addNode', authController.protect, authController.restrictTo('admin', 'user'), nodeController.addNode);
router.get('/getNodes', authController.protect, nodeController.getNodes);
router.get('/getNode/:id', authController.protect, nodeController.getNode);
router.get('/getNodebyOwner/:id', authController.protect, nodeController.getNodebyOwner);

// Routes requiring authentication and specific roles
router.patch('/verifyNode/:id', authController.protect, authController.restrictTo('admin'), nodeController.verifyNode);
router.patch('/updateNodeInventory', authController.protect, authController.restrictTo('admin', 'user'), nodeController.updateNodeInventory);

module.exports = router;
