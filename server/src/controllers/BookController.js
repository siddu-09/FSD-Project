const catchAsync = require('../utils/catchAsync');
const BookService = require('../services/BookService');

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const books = await BookService.getAllBooks({ 
    search: req.query.search, 
    category: req.query.category,
    sort: req.query.sort
  });
  res.status(200).json({ status: 'success', results: books.length, data: { books } });
});

exports.createBook = catchAsync(async (req, res, next) => {
  const newBook = await BookService.createBook(req.body);
  res.status(201).json({ status: 'success', data: { book: newBook } });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await BookService.getBookById(req.params.id);
  res.status(200).json({ status: 'success', data: { book } });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  const updatedBook = await BookService.updateBook(req.params.id, req.body);
  res.status(200).json({ status: 'success', data: { book: updatedBook } });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  await BookService.deleteBook(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});
