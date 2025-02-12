const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

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
        return events;
      },
      //takes an argument and returns it back
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date,
        };
        events.push(event);
        return event;
      },
    },
    graphiql: true, //enables a built-in interactive GUI at "/graphql"
  })
);
app.get("/", (req, res, next) => {
  res.send("Hello World");
});
app.listen(3000);
