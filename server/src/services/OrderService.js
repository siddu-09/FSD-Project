const OrderRepository = require('../repositories/OrderRepository');
const AppError = require('../utils/AppError');

class OrderService {
  async processCheckout(userId, cartItems, totalAmount) {
    if (!cartItems || cartItems.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // In a real app we'd verify totalAmount matches DB prices
    // and integrate Stripe/PayPal here.

    const newOrder = await OrderRepository.create({
      userId,
      total: totalAmount,
      status: 'PROCESSING',
      items: cartItems
    });

    return newOrder;
  }

  async getUserOrders(userId) {
    return await OrderRepository.findByUserId(userId);
  }
}

module.exports = new OrderService();
