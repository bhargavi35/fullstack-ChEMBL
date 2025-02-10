const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "chembl_35",
  password: "3513", // Replace with your actual password
  port: 5432,
});

module.exports = pool;
