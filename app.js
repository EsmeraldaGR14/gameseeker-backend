require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const gameController = require("./controllers/gameController");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/games", gameController);

app.get("/", (req, res) => {
  res.send("Welcome to GameSeeker!");
});

module.exports = app;
