const { nanoid } = require('nanoid');

// Simpan data buku sementara dalam array
let books = [];

// Simpan Buku
const addNewBook = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    
    if (!name) {
        return h.response({ status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku' }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({ status: 'fail', message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' }).code(400);
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    
    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };
    books.push(newBook);

    return h.response({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: id } }).code(201);
};

// Menampilkan Buku
const getBooks = (request, h) => {
    let filteredBooks = [...books];

    if (request.query.name) {
        const nameQuery = request.query.name.toLowerCase();
        filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(nameQuery));
    }
    if (request.query.reading !== undefined) {
        const isReading = request.query.reading === '1';
        filteredBooks = filteredBooks.filter(book => book.reading === isReading);
    }
    if (request.query.finished !== undefined) {
        const isFinished = request.query.finished === '1';
        filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
    }

    return h.response({
        status: 'success',
        data: { books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })) },
    }).code(200);
};

// Detail Buku
const getBookDetails = (request, h) => {
    const book = books.find(b => b.id === request.params.bookId);
    return book
        ? h.response({ status: 'success', data: { book } }).code(200)
        : h.response({ status: 'fail', message: 'Buku tidak ditemukan' }).code(404);
};

// Ubah Buku
const editBook = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) return h.response({ status: 'fail', message: 'Gagal memperbarui buku. Mohon isi nama buku' }).code(400);
    if (readPage > pageCount) return h.response({ status: 'fail', message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount' }).code(400);
    
    const index = books.findIndex(b => b.id === bookId);
    if (index === -1) return h.response({ status: 'fail', message: 'Gagal memperbarui buku. Id tidak ditemukan' }).code(404);
    
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;
    books[index] = { ...books[index], name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt };

    return h.response({ status: 'success', message: 'Buku berhasil diperbarui' }).code(200);
};

// Hapus Buku
const deleteBookById = (request, h) => {
    const index = books.findIndex(b => b.id === request.params.bookId);
    if (index === -1) return h.response({ status: 'fail', message: 'Buku gagal dihapus. Id tidak ditemukan' }).code(404);
    
    books.splice(index, 1);
    return h.response({ status: 'success', message: 'Buku berhasil dihapus' }).code(200);
};

module.exports = { addNewBook, getBooks, getBookDetails, editBook, deleteBookById };
