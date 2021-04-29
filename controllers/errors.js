exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
exports.handleSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request!" });
  } else {
    next(err);
  }
};
exports.handleInternalServerError = (err, req, res, next) => {
  console.log(err);

  res.status(500).send({ msg: "Internal Server Error :O!!" });
};
exports.handleRouteNotFound = (req, res, next) => {
  res.status(404).send({ msg: "route not found" });
};
