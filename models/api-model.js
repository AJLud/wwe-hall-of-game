const pathsData = require("../endpoints.json");

exports.getApiJSON = () => {
  const apiEndpoints = {
    version: "0.1 ;)",
    GET: {
      "categories/": [""],
      "reviews/": ["review_id", "review_id/comments"],
    },
    PATCH: {
      "reviews/": ["review_id"],
    },
    POST: {
      "reviews/": ["review_id/comments"],
    },
  };
  return apiEndpoints;
};
