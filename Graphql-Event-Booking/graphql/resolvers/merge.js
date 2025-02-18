const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

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
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

//return doc for a single event
const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    //It also sets up a property called creator for each event
    //This property is a function created with bind that, when called, will fetch the user who created that event (using the user function)
    creator: user.bind(this, event.creator),
    date: dateToString(event._doc.date),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
