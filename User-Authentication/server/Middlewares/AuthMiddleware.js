const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

if (!process.env.TOKEN_KEY) {
  throw new Error("TOKEN_KEY environment variable is not set");
}

module.exports.userVerification = (req, res) => {
  //check if user has access to the route by matching the tokens
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.status(401).json({ status: false, message: "Invalid token" });
    }

    try {
      const user = await User.findById(data.id);
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }
      return res.status(200).json({ status: true, user: user.username });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error" });
    }
  });
};
