require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/user");
const restaurants = require("./routes/api/restaurant");
const meals = require("./routes/api/meal");
const orders = require("./routes/api/order");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/restaurants", restaurants);
app.use("/api/meals", meals);
app.use("/api/orders", orders);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 6000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
