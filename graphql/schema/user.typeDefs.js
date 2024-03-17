const { gql } = require('../../imports/modules.imports')
const userType = gql`

     type User{
          id: ID!
          username: String!
          name: String
          email: String!
          password: String!
          role: UserRole!
          books:[Book]!
          token: String
     }
     enum UserRole{
          ADMIN
          USER
     }

     type Query{
          users(searchTerm: String, sortOrder: String, sortField: String, offset: Int, limit: Int):[User!]!
     }

     type Mutation {
          createUser(username: String!, email: String!, password: String!,role: UserRole!, books:[String]!):User
          loginUser(email:String!,password:String!): User
     }

`

module.exports = userType