const {
  selectReviewByReviewId,
  updateReviewVotes,
  selectReviews,
} = require("../models/reviews-model");

exports.getReviewByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewByReviewId(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewVotes = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReviewVotes(review_id, inc_votes).then((review) => {
    res.status(200).send({ review });
  });
};
exports.getReviews = (req, res, next) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};
exports.getCommentsByReviewId = (req, res, next) => {
  console.log("HELLOOOOO");
};
