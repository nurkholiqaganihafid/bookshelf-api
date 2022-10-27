/* {
    id: string,
    name: string,
    year: number,
    author: string,
    summary: string,
    publisher: string,
    pageCount: number,
    readPage: number,
    finished: boolean,
    reading: boolean,
    insertedAt: string,
    updatedAt: string
} */

const { nanoid } = require('nanoid');
const books = require('./books');

// POST Method - API save books or add books
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// GET Method - API displays the whole book
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = books;

  if (name) {
    filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading) {
    filteredBooks = books.filter((book) => Number(book.reading) === Number(reading));
  }

  if (finished) {
    filteredBooks = books.filter((book) => Number(book.finished) === Number(finished));
  }

  const listBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books: listBooks,
    },
  });
  response.code(200);
  return response;
};

// GET method by ID - API displays book details
const getBooksByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
};
