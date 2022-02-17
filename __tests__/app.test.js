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
  test("200 - returns 200 Status and the correct number of users", async () => {
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
    test("200 - return 200 status and array of the correct length", async () => {
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
    test("200 - return empty array when topic is valid, but where there are no related articles", async () => {
      const {
        body: { articles },
      } = await request(app).get("/api/articles?topic=paper").expect(200);
      expect(articles).toEqual([]);
    });
    test("404 - return error when user inputs topic which doesn't exist", async () => {
      const {
        body: { msg },
      } = await request(app).get("/api/articles?topic=123").expect(404);
      expect(msg).toBe("user input 123 not found");
    });
  });
  describe("optional query - multiple queries selected", () => {
    test("200 - returns 200 Status", async () => {
      await request(app).get("/api/articles?topic=mitch&order=asc").expect(200);
    });
    test("200 - returns correct length of articles for multiple queries", async () => {
      const {
        body: { articles },
      } = await request(app)
        .get("/api/articles?topic=mitch&sort_by=title&order=asc")
        .expect(200);
      expect(articles).toHaveLength(11);
    });
    test("200 - returns correct article in order for multiple queries", async () => {
      const {
        body: { articles },
      } = await request(app)
        .get("/api/articles?topic=mitch&sort_by=title&order=asc")
        .expect(200);
      expect(articles[0]).toEqual({
        article_id: 6,
        author: "icellusedkars",
        created_at: "2020-10-18T01:00:00.000Z",
        title: "A",
        topic: "mitch",
        votes: 0,
      });
    });
  });
});
describe("GET/api/articles/:article_id", () => {
  test("200 - returns 200 Status and article object with object.keys length of 1", async () => {
    const { body } = await request(app).get("/api/articles/1").expect(200);
    expect(Object.keys(body)).toHaveLength(1);
  });
  test("200 - article object has correct properties", async () => {
    const {
      body: { article },
    } = await request(app).get("/api/articles/1").expect(200);
    expect(article).toEqual(
      expect.objectContaining({
        author: "butter_bridge",
        title: "Living in the shadow of a great man",
        article_id: 1,
        topic: "mitch",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        body: "I find this existence challenging",
      })
    );
  });
  test("404 - returns error when article_id doesn't exist", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/999").expect(404);
    expect(msg).toBe("user input 999 not found");
  });
  test("400 - returns error when user inputs invalid article_id", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/banana").expect(400);
    expect(msg).toBe("Invalid syntax input");
  });
});
describe("PATCH/api/articles/:article_id", () => {
  test("201 - returns 201 status", async () => {
    const votes = { inc_votes: 1 };
    await request(app).patch("/api/articles/1").send(votes).expect(201);
  });
  test("201 - updates vote count when positive value input", async () => {
    const votes = { inc_votes: 1 };
    const {
      body: { article },
    } = await request(app).patch("/api/articles/1").send(votes).expect(201);
    expect(article.votes).toBe(101);
  });
  test("201 - updates vote count when negative value input", async () => {
    const votes = { inc_votes: -10 };
    const {
      body: { article },
    } = await request(app).patch("/api/articles/1").send(votes).expect(201);
    expect(article.votes).toBe(90);
  });
  test("201 - return article object has correct properties", async () => {
    const votes = { inc_votes: 1 };
    const {
      body: { article },
    } = await request(app).patch("/api/articles/1").send(votes).expect(201);
    expect(article).toEqual(
      expect.objectContaining({
        author: "butter_bridge",
        title: "Living in the shadow of a great man",
        article_id: 1,
        topic: "mitch",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 101,
        body: "I find this existence challenging",
      })
    );
  });
  test("400 - error returned when invalid vote value used", async () => {
    const invalidVote = { inc_votes: "banana" };
    const {
      body: { msg },
    } = await request(app)
      .patch("/api/articles/1")
      .send(invalidVote)
      .expect(400);
    expect(msg).toBe("Invalid syntax input");
  });
  test("400 - error when invalid patch request attempted", async () => {
    const invalidPatch = { badPatch: "badPatch" };
    const {
      body: { msg },
    } = await request(app)
      .patch("/api/articles/1")
      .send(invalidPatch)
      .expect(400);
    expect(msg).toBe("Invalid input of inc_votes");
  });
});
describe("GET/api/articles/:article_id/comments", () => {
  test("200 - returns 200 status and an array", async () => {
    const { body } = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);
    expect(Array.isArray(body)).toBe(true);
  });
  test("200 - returns array of the correct length", async () => {
    const { body } = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);
    expect(body).toHaveLength(11);
  });
  test("200 - each array object has the correct properties", async () => {
    const { body } = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);
    body.forEach((comment) => {
      expect(comment).toEqual(
        expect.objectContaining({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        })
      );
    });
  });
  test("200 - returns empty array if article_id is valid but there are no comments", async () => {
    const { body } = await request(app)
      .get("/api/articles/2/comments")
      .expect(200);
    expect(body).toHaveLength(0);
  });
  test("404 - returns error when article_id doesn't exist", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/99/comments").expect(404);
    expect(msg).toBe("user input 99 not found");
  });
  test("404 - returns error when article_id is invalid", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/grapes/comments").expect(400);
    expect(msg).toBe("Invalid syntax input");
  });
});
