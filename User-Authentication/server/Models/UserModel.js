const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required!"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required!"],
  },
  password: {
    type: String,
    required: [true, "Your password is required!"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

//password is hashed prior to saving only if it was modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
