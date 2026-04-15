const express = require('express');
const orderController = require('../controllers/OrderController');
const authController = require('../controllers/AuthController');

const router = express.Router();

// Require users to be logged in to access anything related to orders
router.use(authController.protect);

router.post('/', orderController.checkout);
router.get('/my-orders', orderController.getMyOrders);

module.exports = router;
