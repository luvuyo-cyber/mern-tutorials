const Event = require("../../models/event");
const { transformEvent } = require("./merge");

module.exports = {
  //returns hard coded list of strings
  events: async () => {
    try {
      //return our events
      const events = await Event.find();
      // .populate("creator") //populate: populates any relations we have, our case, the creator field

      return events.map((event) => {
        return transformEvent(event);
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

      createdEvent = transformEvent(result);
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
};
