
const { ApolloError } = require('../imports/modules.imports')
const authMiddleware = (role) => {
     return async (user) => {
          if (!user) {
               throw new ApolloError(`Your are are not authorize.`, "USER_UNAUTHENTICATED")

          }
          if (user.role != role) {
               throw new ApolloError(`Unauthorized: User role must be ${role}`, 'USER_UNAUHTORIZED')
          }

     }
}

module.exports = { authMiddleware }