require("dotenv").config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const app = express();

const gameController = require("./controllers/gameController");
const apiController = require("./controllers/apiController");
const usersController = require("./controllers/usersController");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/games", gameController);
app.use("/api", apiController);
app.use("/users", usersController);

app.get("/", (req, res) => {
  res.send("Welcome to GameSeeker!");
});

app.get("*", (req, res) => {
  res.send("Page not found");
});

module.exports = app;
