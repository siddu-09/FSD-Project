const catchAsync = require('../utils/catchAsync');
const OrderService = require('../services/OrderService');

exports.checkout = catchAsync(async (req, res, next) => {
  const { items, total } = req.body;
  const userId = req.user.id; // comes from auth protection

  const order = await OrderService.processCheckout(userId, items, total);
  
  res.status(201).json({ status: 'success', data: { order } });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await OrderService.getUserOrders(req.user.id);
  
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});
