// routes/transactions.js
const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/transactionController');
const authController = require('../Controllers/authController');

router.get('/medicine/:id', transactionController.getTransactionsByMedicine);
router.get('/getAllTransactions/:page', authController.protect, authController.restrictTo("admin"), transactionController.getAllTransactions);
router.get('/getMyTransactions/:page', authController.protect, transactionController.getMyTransactions);

router.get('/getTransaction/:id', authController.protect, transactionController.getTransaction);

// router.get('/user/:id', authController.protect, transactionController.getTransactions);

module.exports = router;
