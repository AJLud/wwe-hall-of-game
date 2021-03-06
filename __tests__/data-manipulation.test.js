const {
  createReviewsRef,
  combineReviewCommentData,
  unixToSQLDateFormat,
} = require("../db/utils/data-manipulation");

describe("createReviewsRef", () => {
  it("should return a single review_id & title lookup Obj when passed with an array with one item", () => {
    const inputReview = [
      {
        review_id: 1,
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: 1610964020514,
        votes: 1,
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      },
    ];
    const expected = [
      {
        Agricola: 1,
      },
    ];

    expect(createReviewsRef(inputReview)).toEqual(expected);
    expect(createReviewsRef(inputReview)).not.toBe(inputReview);
  });
  it("should return multiple lookupObjects whan passed with a larger array", () => {
    const inputReviews = [
      {
        review_id: 1,
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: 1610964020514,
        votes: 1,
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      },
      {
        review_id: 2,
        title: "Jenga",
        designer: "Leslie Scott",
        owner: "philippaclaire9",
        review_body: "Fiddly fun for all the family",
        category: "dexterity",
        created_at: 1610964101251,
        votes: 5,
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      },
      {
        review_id: 3,
        title: "Ultimate Werewolf",
        designer: "Akihisa Okui",
        owner: "bainesface",
        review_body: "We couldn't find the werewolf!",
        category: "social deduction",
        created_at: 1610964101251,
        votes: 5,
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      },
    ];
    const expected = [
      { Agricola: 1 },
      { Jenga: 2 },
      { "Ultimate Werewolf": 3 },
    ];
    const actual = createReviewsRef(inputReviews);
    expect(actual).toEqual(expected);
    expect(actual).not.toBe(inputReviews);
  });
});

describe("combineReviewCommentData", () => {
  it("should return a single object in an array that has all the comment data and the review id from the lookup object", () => {
    const inputComments = [
      {
        body: "I loved this game too!",
        belongs_to: "Jenga",
        created_by: "happyamy2016",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const inputReviewRef = [{ Jenga: 2 }];
    const expected = [
      {
        belongs_to: "Jenga",
        created_by: "happyamy2016",
        review_id: 2,
        votes: 16,
        created_at: 1511354163389,
        body: "I loved this game too!",
      },
    ];
    const actual = combineReviewCommentData(inputReviewRef, inputComments);
    expect(actual).toEqual(expected);
  });
  it("should return multiple objects in an array that has the data require for input to table", () => {
    const inputComments = [
      {
        body: "I loved this game too!",
        belongs_to: "Jenga",
        created_by: "happyamy2016",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body: "My dog loved this game too!",
        belongs_to: "Agricola",
        created_by: "tickle122",
        votes: 3,
        created_at: 1610964545410,
      },
      {
        body: "I didn't know dogs could play games",
        belongs_to: "Ultimate Werewolf",
        created_by: "weegembump",
        votes: 10,
        created_at: 1610964588110,
      },
    ];
    const inputReviewRef = [
      { Agricola: 1 },
      { Jenga: 2 },
      { "Ultimate Werewolf": 3 },
    ];
    const expected = [
      {
        belongs_to: "Agricola",
        body: "My dog loved this game too!",
        created_by: "tickle122",
        votes: 3,
        created_at: 1610964545410,
        review_id: 1,
      },

      {
        belongs_to: "Jenga",
        body: "I loved this game too!",
        created_by: "happyamy2016",
        votes: 16,
        created_at: 1511354163389,
        review_id: 2,
      },
      {
        belongs_to: "Ultimate Werewolf",
        body: "I didn't know dogs could play games",
        created_by: "weegembump",
        votes: 10,
        created_at: 1610964588110,
        review_id: 3,
      },
    ];

    const actual = combineReviewCommentData(inputReviewRef, inputComments);
    expect(actual).toEqual(expected);
  });
});
