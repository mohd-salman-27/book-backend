const { addBookController, getAllBooks, getSingleBook, borrowBookController, buyBook, requestToBorrowBook, respondToBorrowRequest, updateBookController, deleteBookController } = require('../../imports/controller.imports')
const { authMiddleware } = require("../../middleware/authenticate.middleware")


const bookResolvers = {
     Query: {
          books: async (_, { searchTerm, sortOrder, sortField, offset, limit }) => {
               return await getAllBooks(searchTerm, sortOrder, sortField, offset, limit);
          },
          book: async (_, { id }) => {
               return await getSingleBook(id);
          }
     },
     Mutation: {

          addBook: async (_, { title, author, description, price, owner }, context) => {
               await authMiddleware("ADMIN")(context.user)
               return await addBookController(title, author, description, price, owner)
          },

          updateBook: async (_, { id, title, author, description, price, borrower, owner }, context) => {
               await authMiddleware("ADMIN")(context.user)
               return updateBookController(id, title, author, description, price, borrower, owner)
          },

          deleteBook: async (_, { id }, context) => {
               await authMiddleware("ADMIN")(context.user)
               return deleteBookController(id);
          },

          borrowBook: async (_, { bookId }, context) => {
               return borrowBookController(bookId, context.user)
          },
          buyBook: async (_, { bookId }, context) => {
               return await buyBook(bookId, context.user)
          },
          requestToBorrowBook: async (_, { id }, context) => {
               return await requestToBorrowBook(id, context.user);
          },
          respondToBorrowRequest: async (_, { input }, context) => {
               return await respondToBorrowRequest(input, context.user)
          }

     }
}

module.exports = {
     bookResolvers
}

/*
 
*/