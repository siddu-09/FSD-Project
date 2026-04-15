const express = require('express');
const bookController = require('../controllers/BookController');
// const authController = require('../controllers/AuthController'); // Admin protection later

const router = express.Router();

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(bookController.createBook); // add admin protect later

router
  .route('/:id')
  .get(bookController.getBook)
  .put(bookController.updateBook) // add admin protect later
  .delete(bookController.deleteBook); // add admin protect later

module.exports = router;
