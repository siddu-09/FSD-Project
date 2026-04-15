const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderRepository {
  async create(data) {
    return await prisma.order.create({
      data: {
        userId: data.userId,
        total: data.total,
        status: data.status,
        items: {
          create: data.items.map(item => ({
            bookId: item.bookId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });
  }

  async findByUserId(userId) {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { book: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(id, status) {
    return await prisma.order.update({
      where: { id },
      data: { status }
    });
  }
}

module.exports = new OrderRepository();
