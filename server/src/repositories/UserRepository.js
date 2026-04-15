const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserRepository {
  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  async create(data) {
    return await prisma.user.create({
      data
    });
  }
}

module.exports = new UserRepository();
