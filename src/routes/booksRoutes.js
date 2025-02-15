const booksController = require('../controllers/booksController');

module.exports = [
    { method: 'POST', path: '/books', handler: booksController.addNewBook },
    { method: 'GET', path: '/books', handler: booksController.getBooks },
    { method: 'GET', path: '/books/{bookId}', handler: booksController.getBookDetails },
    { method: 'PUT', path: '/books/{bookId}', handler: booksController.editBook },
    { method: 'DELETE', path: '/books/{bookId}', handler: booksController.deleteBookById },
];
