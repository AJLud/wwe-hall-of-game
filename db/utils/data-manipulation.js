// extract any functions you are using to manipulate your data, into this file

// function to combine comments and review stuff to extract keys and values we need

// func to convert unix timestamp to readble SQL format

exports.unixToSQLDateFormat = (unixTS) => {
  return new Date(unixTS);
};

exports.createReviewsRef = (reviews) => {
  const refArray = reviews.map((review) => {
    const reviewRef = {};
    reviewRef.title = review.title;
    reviewRef.review_id = review.review_id;
    return reviewRef;
  });
  console.log;
  return refArray;
};
// grab only review_id and title

exports.filterResults = (reviews, comments) => {
  let output = [];
  reviews.forEach((review) => {
    comments.forEach((comment) => {
      if (review.title === comment.belongs_to) {
        output.push({ ...review, ...comment });
      }
    });
  });
  return output;
};

// Refactor this: make func to create lookup
// use lookup to match review_id to comment
