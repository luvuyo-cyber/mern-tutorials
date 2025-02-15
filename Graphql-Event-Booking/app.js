const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/event");
const User = require("./models/user");
const bcrypt = require("bcryptjs");

const app = express();
app.use(bodyParser.json()); //to process incoming json bodies

//Looks up a user by their ID and prepares a way (via a function) to get the events they created
const user = (userId) => {
  //find the user by Id
  return User.findById(userId)
    .then((user) => {
      //return an object with all the users data
      return {
        ...user._doc,
        id: user.id,
        //fetches all the events that the user has created
        //The bind method is used here to "pre-load" the function with the list of event IDs from "user._doc.createdEvents"
        //This way, when GraphQL needs to know the details of those events, it calls the function and gets them
        createdEvents: events.bind(this, user._doc.createdEvents),
      };
    })
    .catch((err) => {
      throw err;
    });
};

//Looks up events by a list of IDs and prepares a way (via a function) to get the creator details for each event
const events = (eventIds) => {
  //The $in operator tells the database to look for events whose IDs are in the given list
  return Event.find({
    _id: { $in: eventIds },
  })
    .then((events) => {
      return events.map((event) => {
        return {
          ...event._doc,
          _id: event.id,
          //It also sets up a property called creator for each event
          //This property is a function created with bind that, when called, will fetch the user who created that event (using the user function)
          creator: user.bind(this, event.creator),
        };
      });
    })
    .catch((err) => {
      throw err;
    });
};

app.use(
  "/graphql", //create route to handle graphQL requests
  graphqlHttp({
    //handle graphQL operations that a client can perform
    schema: buildSchema(`
        type Event  {
                _id:    ID!
                title:  String!
                description:    String!
                price:  Float!
                date:   String!
                creator:  User!
        }

        type User {
                _id: ID!
                email: String!
                password: String
                createdEvents:  [Event!]
        }
        
        input EventInput    {
                title:  String!
                description:    String!
                price:  Float!
                date:   String! 
        }

        input UserInput {
                email: String!
                password: String!
        }

        type RootQuery  {
                events: [Event!]!  
        }

        type RootMutation   {
                createEvent(eventInput: EventInput) : Event 
                createUser(userInput: UserInput)  : User
        }

        schema  {
                query:  RootQuery
                mutation:   RootMutation
        }
        `),
    //actual functions that run when someone makes a request
    rootValue: {
      //returns hard coded list of strings
      events: () => {
        //return our events
        return (
          Event.find()
            // .populate("creator") //populate: populates any relations we have, our case, the creator field
            .then((events) => {
              return events.map((event) => {
                return {
                  ...event._doc,
                  _id: event.id, //convert our mongodb id to normal string
                  creator: user.bind(this, event._doc.creator), //get our creator id

                  // creator: {
                  //   ...event._doc.creator._doc, //get our creator doc
                  //   _id: event._doc.creator.id,
                  // },
                };
              });
            })
            .catch((err) => {
              throw err;
            })
        );
      },
      //takes an argument and returns it back
      //Create a new event in the database and link it to a specific user
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: "67b0a07ae69a4821f198d52d",
        });

        let createdEvent;

        //save to database
        return (
          event
            .save()
            .then((result) => {
              createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
              };
              return User.findById("67b0a07ae69a4821f198d52d");
              console.log(result);
            })
            //link event to the user
            .then((user) => {
              if (!user) {
                throw new Error("User not found!");
              }
              user.createdEvents.push(event);
              return user.save();
            })
            .then((result) => {
              return createdEvent;
            })
            .catch((err) => {
              console.log(err);
              throw err;
            })
        );
      },
      //create user resolver
      createUser: (args) => {
        //check if user already exists
        return User.findOne({
          email: args.userInput.email,
        })
          .then((user) => {
            //if they exist throw an error message
            if (user) {
              throw new Error("User exists already!");
            }
            //if not proceed to: encrypt our password
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then((hashedPassword) => {
            //then create a new user
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword,
            });
            //save user to database
            return user.save();
          })
          .then((result) => {
            return { ...result._doc, _id: result.id, password: null }; //make password unretrievable to graphql
          })
          .catch((err) => {
            throw err;
          });
      },
    },
    graphiql: true, //enables a built-in interactive GUI at "/graphql"
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.byeyv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("App is connected to database");

    app.listen(3000, () => {
      console.log("App is listening to port: 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
