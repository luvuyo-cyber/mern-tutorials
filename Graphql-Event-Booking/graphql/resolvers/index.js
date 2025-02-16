const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

//Looks up a user by their ID and prepares a way (via a function) to get the events they created
const user = async (userId) => {
  try {
    //find the user by Id
    const user = await User.findById(userId);

    //return an object with all the users data
    return {
      ...user._doc,
      id: user.id,
      //fetches all the events that the user has created
      //The bind method is used here to "pre-load" the function with the list of event IDs from "user._doc.createdEvents"
      //This way, when GraphQL needs to know the details of those events, it calls the function and gets them
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

//Looks up events by a list of IDs and prepares a way (via a function) to get the creator details for each event
const events = async (eventIds) => {
  try {
    //The $in operator tells the database to look for events whose IDs are in the given list
    const events = await Event.find({
      _id: { $in: eventIds },
    });
    events.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        //It also sets up a property called creator for each event
        //This property is a function created with bind that, when called, will fetch the user who created that event (using the user function)
        creator: user.bind(this, event.creator),
        date: new Date(event._doc.date).toISOString(),
      };
    });
    return events;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  //returns hard coded list of strings
  events: async () => {
    try {
      //return our events
      const events = await Event.find();
      // .populate("creator") //populate: populates any relations we have, our case, the creator field

      return events.map((event) => {
        return {
          ...event._doc,
          _id: event.id, //convert our mongodb id to normal string
          creator: user.bind(this, event._doc.creator), //get our creator id
          date: new Date(event._doc.date).toISOString(),
          // creator: {
          //   ...event._doc.creator._doc, //get our creator doc
          //   _id: event._doc.creator.id,
          // },
        };
      });
    } catch (err) {
      throw err;
    }
  },
  //takes an argument and returns it back
  //Create a new event in the database and link it to a specific user
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "67b0a07ae69a4821f198d52d",
    });

    let createdEvent;
    try {
      //save to database
      const result = await event.save();

      createdEvent = {
        ...result._doc,
        _id: result._doc._id.toString(),
        creator: user.bind(this, result._doc.creator),
        date: new Date(event._doc.date).toISOString(),
      };
      const creator = await User.findById("67b0a07ae69a4821f198d52d");

      //link event to the user
      if (!creator) {
        throw new Error("User not found!");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
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
  },
};
