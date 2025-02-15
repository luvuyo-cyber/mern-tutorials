const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/event");

const app = express();
const events = [];
app.use(bodyParser.json()); //to process incoming json bodies
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
        }
        
        input EventInput    {
                title:  String!
                description:    String!
                price:  Float!
                date:   String! 
        }

        type RootQuery  {
                events: [Event!]!  
        }

        type RootMutation   {
                createEvent(eventInput: EventInput) : Event 
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
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc, _id: event.id }; //convert our mongodb id to normal string
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      //takes an argument and returns it back
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });

        //save to database
        return event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc, _id: result._doc._id.toString() };
          })
          .catch((err) => {
            console.log(err);
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
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
