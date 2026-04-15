const BookRepository = require('../repositories/BookRepository');
const AppError = require('../utils/AppError');

class BookService {
  async getAllBooks(filters) {
    return await BookRepository.findAll(filters);
  }

  async getBookById(id) {
    const book = await BookRepository.findById(id);
    if (!book) {
      throw new AppError('No book found with that ID', 404);
    }
    return book;
  }

  async createBook(data) {
    // We can add validation logic here
    if (!data.title || !data.author || !data.price) {
      throw new AppError('Title, author, and price are required', 400);
    }
    return await BookRepository.create(data);
  }

  async updateBook(id, data) {
    // Check if exists
    await this.getBookById(id);
    return await BookRepository.update(id, data);
  }

  async deleteBook(id) {
    // Check if exists
    await this.getBookById(id);
    return await BookRepository.delete(id);
  }
}

module.exports = new BookService();
