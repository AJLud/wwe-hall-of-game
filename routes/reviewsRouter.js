const {
  getReviewByReviewId,
  patchReviewVotes,
  getReviews,
} = require("../controllers/reviews-controller");
const reviews = require("../db/data/test-data/reviews");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews);
reviewsRouter
  .route("/:review_id")
  .get(getReviewByReviewId)
  .patch(patchReviewVotes);
module.exports = reviewsRouter;
