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

  if (typeof name === 'undefined') {
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
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(404);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const {reading, finished, name} = request.query;
  let data;
  if(typeof reading !== 'undefined') {
    if(reading == 0) data = books.filter((book) => book.reading === false);
    else if (reading == 1)  data = books.filter((book) => book.reading == true); 
  }
  
  if(typeof finished !== 'undefined') {
    if(finished == 0) data = books.filter((book) => book.finished === false);
    else if (finished == 1)  data = books.filter((book) => book.finished == true); 
  }
  
  if(typeof name !== 'undefined') {
    data = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }
  
  if(typeof data === 'undefined') {
    data = books.map(({id, name, publisher }) => ({id, name, publisher}));
  } else {
    data = data.map(({id, name, publisher }) => ({id, name, publisher}));
  }
  
  const response = h.response({
    status: 'success',
    data: {
      books: data,
    },
  })
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const book = books.filter((temp) => temp.id === id)[0];
  
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book: book,
      }
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
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

  if (typeof name === 'undefined') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();
  const finished = (readPage === pageCount) ? true : false;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      'status': 'success',
      'message': 'Buku berhasil dihapus'
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    'status': 'fail',
    'message': 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
}

module.exports = {
  addBookHandler, 
  getAllBooksHandler, 
  getBookByIdHandler, 
  editBookByIdHandler,
  deleteBookByIdHandler
};
