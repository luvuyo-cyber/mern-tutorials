const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");

// Check required environment variables
const requiredEnvVars = ["MONGO_URL", "PORT", "TOKEN_KEY", "NODE_ENV"];

const { MONGO_URL, PORT, NODE_ENV } = process.env;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// CORS configuration
const corsOptions = {
  origin:
    NODE_ENV === "production"
      ? process.env.CLIENT_URL
      : "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/", authRoute);

const port = PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
