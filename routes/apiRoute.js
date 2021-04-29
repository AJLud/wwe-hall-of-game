const apiRouter = require("express").Router();
const { getApi } = require("../controllers/api-controller");
const categoriesRouter = require("./categoriesRoute");
const reviewsRouter = require("./reviewsRouter");

apiRouter.use("/categories", categoriesRouter);

apiRouter.use("/reviews", reviewsRouter);

apiRouter.route("/").get(getApi);

module.exports = apiRouter;
