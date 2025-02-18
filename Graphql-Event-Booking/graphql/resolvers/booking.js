const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");
const Event = require("../../models/event");

module.exports = {
  //fetch our bookings
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  //book an event
  bookEvent: async (args) => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: "67b0a07ae69a4821f198d52d",
      event: fetchedEvent,
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  //cancel bookings
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
