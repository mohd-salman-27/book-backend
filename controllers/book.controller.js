const { ApolloError } = require('../imports/modules.imports')
const { BookModel, UserModel } = require('../imports/models.imports')


const getAllBooks = async (searchTerm, sortOrder, sortField, offset, limit) => {
     try {
          let query = {};
          if (searchTerm) {
               query = { $or: [{ title: { $regex: searchTerm, $options: 'i' } }, { description: { $regex: searchTerm, $options: 'i' } }] };
          }
          let sort = {};
          if (sortField && sortOrder) {
               sort[sortField] = sortOrder === 'asc' ? 1 : -1;
          }

          const books = await BookModel.find(query)
               .sort(sort)
               .skip(offset)
               .limit(limit)
               .populate("owner");
          return books;
     } catch (error) {
          throw new ApolloError('Failed to fetch books', 'BOOKS_FETCHING_ERROR');
     }
}

const getSingleBook = async (id) => {
     try {
          const book = await BookModel.findById(id);
          return book;
     } catch (error) {
          throw new ApolloError('Failed to fetch single book', 'FAILED_TO_FETCH_SINGLE_BOOK');
     }
}

const deleteBookController = async (id) => {
     try {
          await BookModel.findByIdAndDelete(id);
          return id;
     } catch (error) {
          throw new ApolloError(error.message, error.code);
     }
}
const updateBookController = async (id, title, author, description, price, borrower, owner) => {
     try {
          const book = await BookModel.findById(id);

          if (!book) {
               throw new ApolloError("Book not found", "NOT_FOUND_BOOK")
          }
          book.title = title ? title : book.title,
               book.author = author ? author : book.author,
               book.description = description ? description : book.description,
               book.price = price ? price : book.price,
               book.borrower = borrower ? borrower : book.borrower,
               book.owner = owner ? owner : book.owner

          await book.save();

          return book;

     } catch (error) {
          throw new ApolloError(error.message, error.code);

     }
}

const addBookController = async (title, author, description, price, owner) => {
     try {
          console.log(title, author, description, price, owner)
          const newBook = await BookModel.create({ title, author, description, price, owner });
          return newBook
     } catch (error) {
          throw new ApolloError('Failed to new book', 'FAILED_TO_CREATE_BOOK');
     }
}

const borrowBookController = async (bookId, user) => {
     try {
          if (!user) {
               throw new ApolloError("User not authenticated", 'UNAUTHNTICATED')
          }
          const book = await BookModel.findById(bookId);


          if (!book) {
               throw new ApolloError("Book not found", 'NOT_FOUND_BOOK')
          }
          
          if (!book.available) {
               console.log("book available")
               throw new ApolloError("Book is not available for borrowing", "NOT_ABAILABLE_BOOK")
              
          }
          
          book.owner = user._id
          book.available = false
          await book.save();

          return book
     } catch (error) {
          throw new ApolloError("Failed to borrow book", 'BORROWING_FAILED')
     }
}

const buyBook = async (bookId, user) => {
     try {
          if (!user) {
               throw new ApolloError("User not authenticated", 'UNAUTHNTICATED')
          }

          const book = await BookModel.findById(bookId);

          if (!book) {
               throw new ApolloError("Book not found", 'NOT_FOUND_BOOK')
          }

          if (!book.available) {
               throw new ApolloError("Book is already owned by someone", "ALREADY_OWNED")
          }

          book.owner = user._id
          book.available = false
          await book.save();

          return book
     } catch (error) {
          throw new ApolloError("Failed to buy book", 'BUYING_FAILED')
     }
}

const requestToBorrowBook = async (bookId, user) => {
     try {
          // Check if the user is authenticated
          console.log(bookId)
          if (!user) {
               throw new Error('User not authenticated');
          }

          const book = await BookModel.findById(bookId);
          if (!book) {
               throw new Error('Book not found');
          }

          // Check if the book is available for borrowing
          // if (!book.available) {
          //      throw new Error('Book is not available for borrowing');
          // }

          // Notify the owner of the book about the borrowing request
          const owner = await UserModel.findById(book.owner);
          if (!owner) {
               throw new Error('Owner not found');
          }

          console.log(`Borrow request for book "${book.title}" from ${user.username}.`);
          console.log(`Please respond to the request.`);

          return book;

     } catch (error) {
          throw new ApolloError(error.message, error.code);
     }
}

const respondToBorrowRequest = async (input, user) => {
     try {
          // Extract input data
          const { requestId, response } = input

          // Retrieve the borrowing request from the database
          const borrowRequest = await BookModel.findById(requestId);
          // console.log(borrowRequest)

          if (!borrowRequest) {
               throw new Error('Borrow request not found');
          }

          // Check if the user is the owner of the book
          if (!userIsOwnerOfBook(borrowRequest.book, user._id)) {
               throw new Error('User is not authorized to respond to this request');
          }

          // Update the borrowing request status based on the response
          switch (response) {
               case 'APPROVE':
                    borrowRequest.status = 'APPROVED';
                    break;
               case 'REJECT':
                    borrowRequest.status = 'REJECTED';
                    break;
               default:
                    throw new Error('Invalid response');
          }

          // Save the updated borrowing request to the database
          await borrowRequest.save();

          return borrowRequest;
     } catch (error) {
          throw new ApolloError(error.message, error.code);
     }
}

const userIsOwnerOfBook = async (bookId, userId) => {
     const book = await BookModel.findById(bookId);
     return book && book.owner.equals(userId);
};


module.exports = {
     addBookController,
     getAllBooks,
     getSingleBook,
     borrowBookController,
     buyBook,
     requestToBorrowBook,
     respondToBorrowRequest,
     updateBookController,
     deleteBookController
}