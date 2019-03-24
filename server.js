//Create Server
const express = require("express");
const app = express();
var cors = require("cors");
const routes_user = require("./routes/user");
const routes_message = require("./routes/message");

app.use(cors());

require("./startup/middlewares")(app);

// DB connection
require("./startup/db")();

// Configure Routes for Users
app.use("/api/user", routes_user);

// Configure Routes for Messages
app.use("/api/message", routes_message);

// Root Page
app.get("/", function (req, res) {
  res.send("Welcome to my application");
});

// Home Page
app.get("/home", function (req, res) {
  res.send("Welcome to home application");
});

// Listen to Server at Localhost : 3000
app.listen(3000, function () {
  console.log("Server running @ localhost : 3000");
});
