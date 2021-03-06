const request = require("supertest");
const db = require("../db/connection");
const { seed } = require("../db/seeds/seed");
const data = require("../db/data/test-data/index-test");
const app = require("../app");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("WWE Hall of Game", () => {
  describe("1.GET/api/categories", () => {
    test("status: 200, responds with array of categories objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          const { categories } = body;
          expect(categories).toBeInstanceOf(Array);
          expect(categories.length).toBeGreaterThan(0);
          categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              }),
            );
          });
        });
    });
  });

  describe("2.GET/api/reviews/:review_id", () => {
    test("status: 200, responds with a review object, which should contain the properties required ", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toEqual(
            expect.objectContaining({
              review_id: 2,
              title: "Jenga",
              designer: "Leslie Scott",
              owner: "philippaclaire9",
              review_body: "Fiddly fun for all the family",
              category: "dexterity",
              created_at: expect.any(String),
              votes: 5,
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              comment_count: "3",
            }),
          );
        });
    });
    test("status: 404, responds with an Error Message NOT FOUND when parametric param is valid but does not exist in the DB", () => {
      return request(app)
        .get("/api/reviews/333")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found!");
        });
    });
    test("status: 400, responds with an Error Message BAD REQUEST when param is of invalid data type", () => {
      return request(app)
        .get("/api/reviews/not_an_id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request!");
        });
    });
  });

  describe("3.PATCH/api/reviews/:review_id", () => {
    test("status: 200, responds with an updated object", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: 100 })
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toEqual(
            expect.objectContaining({
              review_id: 2,
              title: "Jenga",
              designer: "Leslie Scott",
              owner: "philippaclaire9",
              review_body: "Fiddly fun for all the family",
              category: "dexterity",
              created_at: expect.any(String),
              votes: 105,
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            }),
          );
        });
    });
    test("status: 400, responds with error message BAD REQUEST when inc_votes is not on request body", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request!");
        });
    });
    test("status: 400, responds with error message when inc votes is of invalid data type", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: "potato" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request!");
        });
    });
    test("status: 404, responds with an Error Message NOT FOUND when parametric param is valid but does not exist in the DB", () => {
      return request(app)
        .patch("/api/reviews/999")
        .send({ inc_votes: 300 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found!");
        });
    });
  });
  describe("4.GET/api/reviews", () => {
    test("status: 200, responds with an array of review objects that defaults to sorting by review_id in asc order", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toBeSortedBy(reviews.review_id);
          expect(reviews.length).toBeGreaterThan(0);
          reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                review_id: expect.any(Number),
                title: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_body: expect.any(String),
                category: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                review_img_url: expect.any(String),
                comment_count: expect.any(String),
              }),
            );
          });
        });
    });
    test("status: 200, responds with an array of review objects sorted by title in ascending order", () => {
      return request(app)
        .get("/api/reviews?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toBeSortedBy(reviews.title);
          expect(reviews.length).toBeGreaterThan(0);
          expect(reviews[0]).toEqual({
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: 1,
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            comment_count: expect.any(String),
          });
        });
    });
    test("status: 200, responds with an array of review objects sorted by default, in DESCENDING order when order query is desc", () => {
      return request(app)
        .get("/api/reviews?order_by=desc")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toBeSortedBy(reviews.review_id, { descending: true });
          expect(reviews[0]).toEqual(
            expect.objectContaining({
              review_id: 13,
            }),
          );
        });
    });
    test("status: 200, responds with an array of review object that can take a category type as a filter", () => {
      return request(app)
        .get("/api/reviews?category=social deduction")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews.length).toBeGreaterThan(0);
          reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                category: "social deduction",
              }),
            );
          });
        });
    });
    test("status: 400, responds with invalid sort query when passed with a disallowed query", () => {
      return request(app)
        .get("/api/reviews?sort_by=hotpotato")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Sort Query");
        });
    });
    test("status: 400, responds with invalid order_by query when passed with a disallowed query", () => {
      return request(app)
        .get("/api/reviews?order_by=chaos")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Order Query");
        });
    });
    test("status: 404, responds with not found when category query does not exist in the DB", () => {
      return request(app)
        .get("/api/reviews?category=space marines")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found!");
        });
    });
    test("status: 200, responds with an empty array when category exists in DB but has no Reviews", () => {
      return request(app)
        .get("/api/reviews?category=children's games")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews.length).toBe(0);
        });
    });
  });
  describe("5.GET /api/reviews/:review_id/comments", () => {
    test("status: 200 responds with an array of comments objects belonging to a specific review id", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(3);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              }),
            );
          });
        });
    });
    test("status: 404, responds with error message not found when passed with a id that is valid but does not exist in the DB", () => {
      return request(app)
        .get("/api/reviews/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found!");
        });
    });
    test("status: 200, responds with an empty array when category exists in DB but has no Reviews", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(0);
        });
    });
    test("status: 400, responds with 400 bad request when review_id is of invalid datatype", () => {
      return request(app)
        .get("/api/reviews/this_is_not_an_id/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request!");
        });
    });
  });
  describe("6.POST/api/reviews/review_id/comments", () => {
    test("status: 201, responds with the posted comment", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ username: "bainesface", body: "Farming is dead good innit" })
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: 7,
              votes: 0,
              created_at: expect.any(String),
              author: "bainesface",
              body: "Farming is dead good innit",
            }),
          );
        });
    });
    test("status: 404, responds with error Bad Request if the username does not exist in the database", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "doesntexist",
          body: "Mr Anderson? How can you write a review if you don't exist",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found!");
        });
    });
    test("status: 400, responds with error Bad Request if username or body is undefined", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request!");
        });
    });
    test("status: 400, responds with error Bad Request if the post has additional properties other than username and body", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "bainesface",
          body: "Farming is dead good innit",
          votes: 100,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request!");
        });
    });
    test("status: 404, responds with error Bad Request if the review id does not exist in the DB", () => {
      return request(app)
        .post("/api/reviews/999/comments")
        .send({ username: "bainesface", body: "Farming is dead good innit" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found!");
        });
    });
  });
  describe("7.GET/api", () => {
    test("status: 200, responds with a JSON describing all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(endpoints);
        });
    });
  });
});
