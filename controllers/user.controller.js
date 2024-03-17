const { ApolloError, bcrypt } = require('../imports/modules.imports')
const { UserModel, BookModel } = require('../imports/models.imports')
const { generateToken } = require('../imports/config.imports')

const createUser = async (username, email, password, role, books) => {
     try {
          const usernameExist = await UserModel.findOne({ username });
          const emailExist = await UserModel.findOne({ email });

          // if (usernameExist) {
          //      throw new ApolloError("A user is already registered with the user " + username, "USERNAME_ALREADY_EXIST");
          // }
          if (emailExist) {
               throw new ApolloError("A user is already registered with the email " + email, "EMAIL_ALREADY_EXIST");
          }

          const hashPassword = await bcrypt.hash(password, 10);

          for (const book of books) {
               const existingBook = await BookModel.findOne({ _id: book });
               console.log(existingBook)
               if (!existingBook) {
                    throw new ApolloError(`Book with ID ${book} does not exist`, "BOOK_NOT_FOUND");
               }
               if (existingBook.available) {
                    throw new ApolloError(`Book with ID ${book} is not available for purchase or like`, "BOOK_NOT_AVAILABLE");
               }
          }


          const newUser = new UserModel({
               username: username,
               email: email,
               password: hashPassword,
               role: role,
               books: books
          })

          const token = generateToken(newUser._id);

          newUser.token = token;

          await newUser.save();

          return newUser;

     } catch (error) {
          console.error('Failed to create user:', error);
          throw new ApolloError(`Failed to create user: ${error.message}`, "FAILED_TO_CREATE");
     }
}

const loginUser = async (email, password) => {
     try {
          const userWithEmail = await UserModel.findOne({ email });
          // const userWithUsername = await UserModel.findOne({ username });

          if (!userWithEmail) {
               throw new ApolloError(`Email does not exist ${email}`, 'EMAIL_NOT_EXIST');
          }
          // if (!userWithUsername) {
          //      throw new ApolloError(`Username does not exist ${username}`, 'USERNAME_NOT_EXIST');
          // }

          const ePassword = bcrypt.compare(password, userWithEmail.password);
          // const uPassword = bcrypt.compare(userWithUsername.password);

          if (userWithEmail && ePassword) {
               const token = generateToken(userWithEmail._id);

               userWithEmail.token = token;

               return {
                    id: userWithEmail._id,
                    ...userWithEmail._doc
               }
          } else {
               throw new ApolloError('Incorrect Password', "INCORRECT_PASSWORD")
          }
     } catch (error) {
          throw new ApolloError('Failed to login', 'FAILED_TO_LOGIN');
     }
}

const getAllUsers = async (searchTerm, sortOrder, sortField, offset, limit) => {
     try {
          let query = {};
          if (searchTerm) {
               query = { $or: [{ title: { $regex: searchTerm, $options: 'i' } }, { description: { $regex: searchTerm, $options: 'i' } }] };
          }
          let sort = {};
          if (sortField && sortOrder) {
               sort[sortField] = sortOrder === 'asc' ? 1 : -1;
          }

          const users = await UserModel.find(query)
               .sort(sort)
               .skip(offset)
               .limit(limit)
               .populate('books');
          return users;
     } catch (error) {
          throw new ApolloError('Failed to fetch users', 'USER_FETCHING_ERROR');
     }
}

module.exports = {
     createUser,
     loginUser,
     getAllUsers
}






