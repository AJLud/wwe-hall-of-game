const db = require("../db/connection");

exports.selectReviewByReviewId = (review_id) => {
  return db
    .query(
      `
      SELECT reviews.*, COUNT(comment_id) AS comment_count
      FROM reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id
      ORDER BY review_id ASC;
    `,
      [review_id],
    )
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found!" });
      } else return review.rows[0];
    });
};

exports.updateReviewVotes = (review_id, inc_votes) => {
  return db
    .query(
      `
      UPDATE reviews
      SET
        votes = votes + $2
      WHERE review_id = $1
      RETURNING *;
      `,
      [review_id, inc_votes],
    )
    .then((result) => {
      return result.rows[0];
    });
};
exports.selectReviews = () => {
  return db
    .query(
      `
        SELECT reviews.*, COUNT(comment_id) AS comment_count
        FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        
        GROUP BY reviews.review_id
        ORDER BY review_id ASC;
        `,
    )
    .then((result) => {
      return result.rows;
    });
};
