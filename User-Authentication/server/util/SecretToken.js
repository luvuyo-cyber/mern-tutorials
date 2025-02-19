require("dotenv").config();
const jwt = require("jsonwebtoken");

//creates a token
module.exports.createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
