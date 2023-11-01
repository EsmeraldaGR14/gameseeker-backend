const pgp = require("pg-promise")();
require("dotenv").config();

const cn = {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
};

const db = pgp(cn);

db.connect()
  .then((obj) => {
    console.log("Postgres connection established");
    obj.done();
  })
  .catch((e) => {
    console.log("ERROR:", e.message || e);
  });

module.exports = db;
