const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRoute.js");
const {
  handleCustomErrors,
  handleSQLErrors,
  handleInternalServerError,
  handleRouteNotFound,
} = require("./controllers/errors");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handleRouteNotFound);

app.use(handleCustomErrors);

app.use(handleSQLErrors);

app.use(handleInternalServerError);

module.exports = app;
