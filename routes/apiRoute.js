const apiRouter = require("express").Router();
const categoriesRouter = require("./categoriesRoute");
const reviewsRouter = require("./reviewsRouter");

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);

module.exports = apiRouter;
