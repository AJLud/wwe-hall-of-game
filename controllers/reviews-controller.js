const {
  selectReviewByReviewId,
  updateReviewVotes,
  selectReviews,
  selectCommentsByReviewId,
  insertCommentToReview,
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
  updateReviewVotes(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const { order_by } = req.query;
  const { category } = req.query;
  const { sort_by } = req.query;
  selectReviews(sort_by, order_by, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;

  selectCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentToReview = (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req;

  insertCommentToReview(review_id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
