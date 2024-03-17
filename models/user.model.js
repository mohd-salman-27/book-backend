const { mongoose } = require('../imports/modules.imports')

const userSchema = mongoose.Schema({
     username: { type: String, required: true, unique: true },
     name: { type: String },
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true },
     role: { type: String, enum: ["ADMIN", "USER"], default: "user" },
     token: { type: String },
     
     books: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Books"
     }]

}, { timestamp: true })
const UserModel = mongoose.model("Users", userSchema);

module.exports = {
     UserModel
}