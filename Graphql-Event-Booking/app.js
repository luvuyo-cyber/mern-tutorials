const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json()); //to process incoming json bodies

app.get("/", (req, res, next) => {
  res.send("Hello World");
});
app.listen(3000);
