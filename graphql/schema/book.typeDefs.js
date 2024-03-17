const { gql } = require('../../imports/modules.imports')
const bookType = gql`
     type Book {
          id: ID!
          title: String!
          author: String!
          borrower: User!
          owner: User
          available: Boolean
          description: String
          status: BorrowRequestStatus!
          price: Int!
     }

     type Query {
          books(searchTerm: String, sortOrder: String, sortField: String, offset: Int, limit: Int): [Book!]!
          book(id: ID!): Book!
     }

     enum BorrowRequestStatus {
          PENDING
          APPROVED
          REJECTED
     }

     input RespondToBorrowRequestInput {
          requestId: ID!
          response: BorrowRequestResponse!
     }

     enum BorrowRequestResponse {
          APPROVE
          REJECT
     }

     type Mutation {
          addBook(title: String!, author: String!, description: String, price: Int!, owner: String): Book!
          updateBook(id: ID!,title: String, author: String, description: String, price: Int, borrower: String, owner: String): Book!
          deleteBook(id: ID!): Book!

          borrowBook(bookId: ID!): Book!
          buyBook(bookId: ID!): Book!
          requestToBorrowBook(id: ID!): Book!
          respondToBorrowRequest(input: RespondToBorrowRequestInput!): Book!
     }
`

module.exports = bookType