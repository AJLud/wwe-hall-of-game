// extract any functions you are using to manipulate your data, into this file

// function to combine comments and review stuff to extract keys and values we need

// func to convert unix timestamp to readble SQL format

exports.unixToSQLDateFormat = (unixTS) => {
  return new Date(unixTS);
};

exports.createReviewsRef = (reviews) => {
  let reviewsRefArray = [];
  reviews.forEach((review) => {
    let reviewRef = {};
    reviewRef[review.title] = review.review_id;
    reviewsRefArray.push(reviewRef);
  });
  return reviewsRefArray;
};
// grab only review_id and title

// exports.filterResults = (reviews, comments) => {
//   let output = [];
//   reviews.forEach((review) => {
//     comments.forEach((comment) => {
//       if (review.title === comment.belongs_to) {
//         output.push({ ...review, ...comment });
//       }
//     });
//   });
//   return output;
// };

exports.combineReviewCommentData = (reviewLookUps, comments) => {
  let combinedDataArray = [];
  reviewLookUps.forEach((reviewLookUp) => {
    const reviewLookUpEntries = Object.entries(reviewLookUp);
    comments.forEach((comment) => {
      if (comment.belongs_to === reviewLookUpEntries[0][0]) {
        combinedDataArray.push({
          ...comment,
          review_id: reviewLookUpEntries[0][1],
        });
      }
    });
  });
  return combinedDataArray;
};
// Refactor this: make func to create lookup
// use lookup to match review_id to comment
