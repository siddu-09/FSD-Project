const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class BookRepository {
  async findAll({ search, category }) {
    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } }
      ];
    }
    if (category) {
      where.category = category;
    }
    
    return await prisma.book.findMany({
      where,
      orderBy: { createdAt: 'desc' }
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
