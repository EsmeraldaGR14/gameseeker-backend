require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to GameSeeker!");
});

app.get("*", (req, res) => {
  res.send("Page not found");
});

module.exports = app;
