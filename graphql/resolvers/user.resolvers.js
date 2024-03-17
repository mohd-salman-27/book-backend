const { createUser, loginUser, getAllUsers } = require('../../imports/controller.imports')


const userResolvers = {
     Query: {
          users: async (_, { searchTerm, sortOrder, sortField, offset, limit }) => {
               return await getAllUsers(searchTerm, sortOrder, sortField, offset, limit);
          }
     },
     Mutation: {
          createUser: async (_, { username, email, password, role, books }) => {
               return await createUser(username, email, password, role, books);
          },
          loginUser: async (_, { email, password }) => {
               return await loginUser(email, password)
          }
     }
}

module.exports = {
     userResolvers
}