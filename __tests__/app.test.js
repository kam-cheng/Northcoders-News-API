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
  test("200 - returns articles in date descending order", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body.articles).toBeSortedBy("created_at", { descending: true });
  });
});
describe("GET/api/articles/:article_id", () => {
  test("200 - returns 200 Status with valid article_id", async () => {
    await request(app).get("/api/articles/1").expect(200);
  });
  test("200 - returns article object with object.keys length of 1", async () => {
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
    expect(msg).toBe("No article found for article_id: 999");
  });
  test("400 - returns error when user inputs invalid article_id", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/banana").expect(400);
    expect(msg).toBe("Invalid input of article_id");
  });
});
describe("PATCH/api/articles/:article_id", () => {
  test("202 - returns 202 status", async () => {
    const votes = { inc_votes: 1 };
    await request(app).patch("/api/articles/1").send(votes).expect(202);
  });
  test("202 - updates vote count when positive value input", async () => {
    const votes = { inc_votes: 1 };
    const {
      body: { updatedVotes },
    } = await request(app).patch("/api/articles/1").send(votes).expect(202);
    expect(updatedVotes.votes).toBe(101);
  });
  test("202 - updates vote count when negative value input", async () => {
    const votes = { inc_votes: -10 };
    const {
      body: { updatedVotes },
    } = await request(app).patch("/api/articles/1").send(votes).expect(202);
    expect(updatedVotes.votes).toBe(90);
  });
  test("400 - error returned when invalid vote value used", async () => {
    const invalidVote = { inc_votes: "banana" };
    const {
      body: { msg },
    } = await request(app)
      .patch("/api/articles/1")
      .send(invalidVote)
      .expect(400);
    expect(msg).toBe("Invalid input of inc_votes");
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
