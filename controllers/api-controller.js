const { getApiJSON } = require("../models/api-model");

exports.getApi = (req, res, next) => {
  const apiEndpointsJSON = getApiJSON();
  res.status(200).send(apiEndpointsJSON);
};
