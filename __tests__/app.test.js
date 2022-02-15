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
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        body: expect.any(String),
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
