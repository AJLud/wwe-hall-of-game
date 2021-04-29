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
  //   const apiEndpointsJSON = JSON.stringify(apiEndpoints);
  return apiEndpoints;
};
