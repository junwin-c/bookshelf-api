const {nanoid} = require('nanoid');
const books = require('./books');

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
  const finished = (readPage === pageCount) ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  if (name.length === 0) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code = 400;
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code = 400;
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
    response.code = 201;
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code = 404;
  return response;
};

const getAllBooksHandler = (request, h) => {
  const response = h.response({
    status: 'success',
    data: {
      books: books,
    },
  })
  response.code = 200;
  return response;
}

const getBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const book = books.filter((temp) => temp.id === id)[0];
  
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      }
    });
    response.code = 200;
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code = 404;
  return response;
}
module.exports = {addBookHandler, getAllBooksHandler, getBookByIdHandler};
