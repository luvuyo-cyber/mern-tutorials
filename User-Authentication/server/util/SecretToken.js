require("dotenv").config();
const jwt = require("jsonwebtoken");

if (!process.env.TOKEN_KEY) {
  throw new Error("TOKEN_KEY environment variable is not set");
}

//creates a token
module.exports.createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: "24h", // Match cookie expiration
  });
};
