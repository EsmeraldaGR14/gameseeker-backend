require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const gameController = require("./controllers/gameController");
const apiController = require("./controllers/apiController");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/games", gameController);
app.use("/api", apiController);

app.get("/", (req, res) => {
  res.send("Welcome to GameSeeker!");
});

app.get("*", (req, res) => {
  res.send("Page not found");
});

module.exports = app;
