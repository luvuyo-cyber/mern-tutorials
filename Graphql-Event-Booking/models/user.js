const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  //which user created which event
  createdEvents: [
    //retrieve ids' of events a specific user has created
    {
      type: Schema.Types.ObjectId,
      ref: "Event", //let mongoose know that two models are related, use name of model we want to connect with
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
