// make a connection to your database here
// and export it so that you can use it to interact with your database
require("dotenv").config({ path: path.resolve(__dirname, `../.env.${ENV}`) });
const { Pool } = require("pg");
const path = require("path");

const ENV = process.env.NODE_ENV || "development";

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new error("PGDATABASE or DATABASE_URL not set");
}
module.exports = new Pool(config);
