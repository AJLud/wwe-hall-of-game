const request = require("supertest");
const db = require("../db/connection");
const { seed } = require("../db/seeds/seed");
const {
  categoryData,
  commentsData,
  reviewsData,
  usersData,
} = require("../db/data/test-data/index-test");
const app = require("../app");

beforeEach(() => {
  return seed(categoryData, usersData, reviewsData, commentsData);
});

afterAll(() => {
  return db.end();
});

describe("NCGAMES", () => {
  describe("1.GET/api/categories", () => {
    test("status: 200 responds with array of categories objects", () => {
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
    test("status: 200 responds with a review object, which should contain the properties required ", () => {
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
    test("status: 404, responds with an Error Message NOT FOUND", () => {
      return request(app)
        .get("/api/reviews/333")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found!");
        });
    });
    test("status: 400, responds with an Error Message BAD REQUEST", () => {
      return request(app)
        .get("/api/reviews/not_an_id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request!");
        });
    });
  });

  describe("3.PATCH/api/reviews/:review_id", () => {
    test("status: 200 responds with an updated object", () => {
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
  });
  describe("4.GET/api/reviews", () => {
    test("status: 200 respond with an array of review objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeInstanceOf(Array);
          // expect(reviews[0].review_id).toBeLessThan(reviews[1].review_id);
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
  });
  // describe("5.GET /api/reviews/:review_id/comments", () => {
  //   test('"status: 200 respond with an array of comments objects belonging to a specific review id"', () => {
  //     return request(app).get("/api/reviews/2/comments").expect(200);
  //   });
  // });
});
