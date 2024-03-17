const { jwt } = require("../imports/modules.imports")

const generateToken = (id) => {
     return jwt.sign({ userID: id }, process.env.PRIVATE_KEY, { expiresIn: "5h" });
}

module.exports = { generateToken }