const { mongoose } = require('../imports/modules.imports')

const bookSchema = mongoose.Schema({
     title: { type: String, required: true },
     author: { type: String, required: true },
     owner: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
     available: { type: Boolean, default: true },
     description: { type: String },
     price: { type: Number, required: true },
     status: {
          type: String, enum: ["PENDING",
               "APPROVED",
               "REJECTED"], default: "PENDING"
     }

}, { timestamp: true })
const BookModel = mongoose.model("Books", bookSchema);

module.exports = {
     BookModel
}