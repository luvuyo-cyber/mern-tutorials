const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const graphQLSchema = require("./graphql/schema/index");
const graphQLResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

const app = express();
app.use(bodyParser.json()); //to process incoming json bodies
app.use(isAuth); //authentication middleware

app.use(
  "/graphql", //create route to handle graphQL requests
  graphqlHttp({
    //handle graphQL operations that a client can perform
    schema: graphQLSchema,
    //actual functions that run when someone makes a request
    rootValue: graphQLResolvers,
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
