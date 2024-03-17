const { bookResolvers } = require('../graphql/resolvers/book.resolvers')
const { userResolvers } = require('../graphql/resolvers/user.resolvers')

const bookType = require('../graphql/schema/book.typeDefs')
const userType = require('../graphql/schema/user.typeDefs')



module.exports = {
     bookResolvers,
     userResolvers,
     bookType,
     userType
}