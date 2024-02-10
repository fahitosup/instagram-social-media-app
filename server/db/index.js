const { Pool } = require("pg");
require("dotenv").config();

const dev = process.env.NODE_ENV === "development" ? true : false;

const pool = dev
  ? new Pool({
      user: process.env.DEV_DB_USER,
      host: process.env.DEV_DB_HOST,
      database: process.env.DEV_DB_NAME,
      password: process.env.DEV_DB_PASSWORD,
      port: process.env.DEV_DB_PORT,
    })
  : new Pool({
      connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    });

module.exports = {
  query: (text, params) => pool.query(text, params),
};
