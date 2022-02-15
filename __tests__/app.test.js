const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const connection = require("../db/connection.js");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("GET/api/topics", () => {
  test("200 - returns 200 Status", async () => {
    await request(app).get("/api/topics").expect(200);
  });
  test("200 - returns array of objects with slug and description properties", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);
    body.topics.forEach((slug) => {
      expect(slug).toEqual(
        expect.objectContaining({
          slug: expect.any(String),
          description: expect.any(String),
        })
      );
    });
  });
  test('404 - returns 404 Status and Message "Path Not Found"', async () => {
    const { body } = await request(app).get("/bad-path").expect(404);
    expect(body.msg).toBe("Path does not exist");
  });
});

describe("GET/api/users", () => {
  test("200 - returns 200 Status", async () => {
    await request(app).get("/api/users").expect(200);
  });
  test("200 - returns correct number of users", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    expect(body.users).toHaveLength(4);
  });
  test("200 - returns users object containing array of objects with the username property", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    body.users.forEach((user) => {
      expect(user).toEqual(
        expect.objectContaining({
          username: expect.any(String),
        })
      );
    });
  });
});

describe("GET/api/articles", () => {
  describe("default - function without queries", () => {
    test("200 - returns 200 Status", async () => {
      await request(app).get("/api/articles").expect(200);
    });
    test("200 - return array of the correct length", async () => {
      const { body } = await request(app).get("/api/articles").expect(200);
      expect(body.articles).toHaveLength(12);
    });
    test("200 - returns array of article objects with numerous properties", async () => {
      const { body } = await request(app).get("/api/articles").expect(200);
      body.articles.forEach((article) => {
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
    });
    test("200 - returns articles in date descending order (default)", async () => {
      const { body } = await request(app).get("/api/articles").expect(200);
      expect(body.articles).toBeSortedBy("created_at", { descending: true });
    });
  });
  describe("optional query - sort_by ", () => {
    test("200 - returns 200 Status", async () => {
      await request(app).get("/api/articles?sort_by=author").expect(200);
    });
    test("200 - returns articles in order of valid column in descending order", async () => {
      const {
        body: { articles },
      } = await request(app).get("/api/articles?sort_by=title").expect(200);
      expect(articles).toBeSortedBy("title", { descending: true });
    });
    test("400 - returns error if column specified is not on green list", async () => {
      const {
        body: { msg },
      } = await request(app).get("/api/articles?sort_by=bananas").expect(400);
      expect(msg).toBe("invalid sort by query specified: bananas");
    });
  });
  describe("optional query - order", () => {
    test("200 - returns 200 Status", async () => {
      await request(app).get("/api/articles?order=asc").expect(200);
    });
    test("200 - returns articles in created_at ascending order", async () => {
      const {
        body: { articles },
      } = await request(app).get("/api/articles?order=asc").expect(200);
      expect(articles).toBeSortedBy("created_at");
    });
    test("400 - returns error if order specified is not on green list", async () => {
      const {
        body: { msg },
      } = await request(app).get("/api/articles?order=oranges").expect(400);
      expect(msg).toBe("invalid order query specified: oranges");
    });
  });
  describe("optional query - topic", () => {
    test("200 - returns 200 Status", async () => {
      await request(app).get("/api/articles?topic=cats").expect(200);
    });
    test("200 - returns correct number of articles based on filter", async () => {
      const {
        body: { articles },
      } = await request(app).get("/api/articles?topic=cats").expect(200);
      expect(articles).toHaveLength(1);
    });
    test("200 - returns correct article(s) based on filter", async () => {
      const {
        body: { articles },
      } = await request(app).get("/api/articles?topic=cats").expect(200);
      expect(articles[0]).toEqual({
        article_id: 5,
        author: "rogersop",
        created_at: "2020-08-03T13:14:00.000Z",
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        votes: 0,
      });
    });
    test("404 - error when topic is ");
  });
});
