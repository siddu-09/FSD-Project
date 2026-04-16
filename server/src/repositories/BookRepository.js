const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class BookRepository {
  async findAll({ search, category, sort }) {
    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    const orderBy =
      sort === 'price_asc'
        ? { price: 'asc' }
        : sort === 'price_desc'
        ? { price: 'desc' }
        : sort === 'title_asc'
        ? { title: 'asc' }
        : { createdAt: 'desc' };
    
    return await prisma.book.findMany({
      where,
      orderBy
    });
  }

  async findById(id) {
    return await prisma.book.findUnique({
      where: { id }
    });
  }

  async create(data) {
    return await prisma.book.create({
      data
    });
  }

  async update(id, data) {
    return await prisma.book.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return await prisma.book.delete({
      where: { id }
    });
  }
}

module.exports = new BookRepository();
