const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
app.use(bodyParser.json()); //to process incoming json bodies
app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
        type RootQuery  {
                events: [String!]!
        }

        type RootMutation   {
                createEvent(name:   String) : String
        }

        schema  {
                query:  RootQuery
                mutation:   RootMutation
        }
        `),
    rootValue: {
      events: () => {
        return [
          "Night out with the Homies",
          "Watching Harry Potter",
          "Get lucky",
        ];
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      },
    },
    graphiql: true,
  })
);
app.get("/", (req, res, next) => {
  res.send("Hello World");
});
app.listen(3000);
