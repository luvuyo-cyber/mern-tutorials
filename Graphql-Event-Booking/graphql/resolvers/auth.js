const User = require("../../models/user");
const bcrypt = require("bcryptjs");


module.exports = {
  //create user resolver
  createUser: async (args) => {
    try {
      //check if user already exists
      const existingUser = await User.findOne({
        email: args.userInput.email,
      });

      //if they exist throw an error message
      if (existingUser) {
        throw new Error("User exists already!");
      }
      //if not proceed to: encrypt our password
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      //then create a new user
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      //save user to database
      const result = await user.save();

      return { ...result._doc, _id: result.id, password: null }; //make password unretrievable to graphql
    } catch (err) {
      throw err;
    }
  }
};
