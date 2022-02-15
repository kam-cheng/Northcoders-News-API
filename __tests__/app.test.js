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
