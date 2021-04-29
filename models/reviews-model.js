const db = require("../db/connection");
const { sort } = require("../db/data/test-data/users");

// SELECT REVIEWS VIA REVIEW ID - PROMISE CHAIN
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
// UPDATE REVIEW VOTES! - PROMISE CHAIN
exports.updateReviewVotes = (review_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request!",
    });
  }
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
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found!" });
      }
      return result.rows[0];
    });
};
// SELECT REVIEWS - REFACTORED INTO AWAIT ASYNC FORMAT
exports.selectReviews = async (
  sort_by = "review_id",
  order_by = "asc",
  category,
) => {
  // Sanitise the sort by query to match only what we allow
  if (
    !["title", "designer", "owner", "category", "votes", "review_id"].includes(
      sort_by,
    )
  ) {
    return Promise.reject({ status: 400, msg: "Invalid Sort Query" });
  }
  //Sanitise the order by query to only allow asc + desc
  if (!["asc", "desc"].includes(order_by)) {
    return Promise.reject({ status: 400, msg: "Invalid Order Query" });
  }
  // create a modular query that accepts optional input
  const categoryValue = [];
  let queryStr = `SELECT reviews.*, COUNT(comment_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  `;

  if (category) {
    categoryValue.push(category);
    queryStr += `WHERE category = $1`;
  }
  queryStr += `GROUP BY reviews.review_id
  ORDER BY ${sort_by} ${order_by};`;
  const { rows } = await db.query(queryStr, categoryValue);
  if (rows.length === 0) {
    const result = await db.query(`SELECT * FROM categories WHERE slug = $1;`, [
      category,
    ]);
    if (result.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not Found!" });
    }
  }

  return rows;
};
