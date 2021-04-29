const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRoute.js");
app.use(express.json());
app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request!" });
  }
});

module.exports = app;
