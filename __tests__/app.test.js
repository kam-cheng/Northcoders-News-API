const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const connection = require("../db/connection.js");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("GET/api", () => {
  test("200 - returns 200 Status and JSON parsed endpoints", async () => {
    const { body } = await request(app).get("/api").expect(200);
    expect(typeof body).toBe("object");
  });
});
describe("/topics", () => {
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
  describe("POST/api/topics", () => {
    test("201 - status response and return object of length one", async () => {
      const newTopic = {
        slug: "new topic",
        description: "new topic description",
      };
      const { body } = await request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(201);
      expect(Object.keys(body)).toHaveLength(1);
    });
    test("201 - returns with posted topic", async () => {
      const newTopic = {
        slug: "new topic",
        description: "new topic description",
      };
      const {
        body: { topic },
      } = await request(app).post("/api/topics").send(newTopic).expect(201);
      expect(topic).toEqual({
        slug: "new topic",
        description: "new topic description",
      });
    });
    test("400 - error if object sent is invalid", async () => {
      const badTopic = {
        badtopic: "this is a bad topic",
      };
      const {
        body: { msg },
      } = await request(app).post("/api/topics").send(badTopic).expect(400);
      expect(msg).toBe("Invalid input by user");
    });
  });
});
describe("/users", () => {
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
  describe("GET/api/users/:username", () => {
    test("200 - returns 200 status and object of the correct length", async () => {
      const { body } = await request(app).get("/api/users/jonny").expect(200);
      expect(Object.keys(body)).toHaveLength(1);
    });
    test("200 - user object has correct properties", async () => {
      const {
        body: { user },
      } = await request(app).get("/api/users/jonny").expect(200);
      expect(user).toEqual(
        expect.objectContaining({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        })
      );
    });
    test("404 - returns error if username does not exist", async () => {
      const {
        body: { msg },
      } = await request(app).get("/api/users/non-user").expect(404);
      expect(msg).toBe("user input non-user not found");
    });
  });
});
describe("/articles", () => {
  describe("GET/api/articles", () => {
    describe("default - function without queries", () => {
      test("200 - return 200 status and array of the correct length", async () => {
        const { body } = await request(app)
          .get("/api/articles?limit=100")
          .expect(200);
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
              comment_count: expect.any(String),
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
          comment_count: "2",
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
        await request(app)
          .get("/api/articles?topic=mitch&order=asc")
          .expect(200);
      });
      test("200 - returns correct length of articles for multiple queries", async () => {
        const {
          body: { articles },
        } = await request(app)
          .get("/api/articles?topic=mitch&sort_by=title&order=asc&limit=100")
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
          comment_count: "1",
        });
      });
    });
    describe("optional query - paginated queries", () => {
      test("200 - returns 200 Status", async () => {
        await request(app).get("/api/articles?limit=3&p=1").expect(200);
      });
      test("200 - default limit of 10 articles returned", async () => {
        const {
          body: { articles },
        } = await request(app).get("/api/articles").expect(200);
        expect(articles).toHaveLength(10);
      });
      test("200 - limit of articles can be changed", async () => {
        const {
          body: { articles },
        } = await request(app).get("/api/articles?limit=5").expect(200);
        expect(articles).toHaveLength(5);
      });
      test("200 - page can also be set", async () => {
        const {
          body: { articles },
        } = await request(app).get("/api/articles?limit=10&p=2").expect(200);
        expect(articles).toEqual([
          {
            article_id: 11,
            author: "icellusedkars",
            created_at: "2020-01-15T22:21:00.000Z",
            title: "Am I a cat?",
            topic: "mitch",
            votes: 0,
            comment_count: "0",
          },
          {
            article_id: 7,
            author: "icellusedkars",
            created_at: "2020-01-07T14:08:00.000Z",
            title: "Z",
            topic: "mitch",
            votes: 0,
            comment_count: "0",
          },
        ]);
      });
      test("200 - new total_count property ignores list limit", async () => {
        const {
          body: { total_count },
        } = await request(app).get("/api/articles?limit=10&p=2").expect(200);
        expect(total_count).toBe(12);
      });
      test("200 - total_count property correctly calculates filtered articles", async () => {
        const {
          body: { total_count },
        } = await request(app)
          .get("/api/articles?limit=10&p=2&topic=mitch")
          .expect(200);
        expect(total_count).toBe(11);
      });
      test("400 - error when user input of limit is invalid", async () => {
        const {
          body: { msg },
        } = await request(app)
          .get("/api/articles?limit=badrequest")
          .expect(400);
        expect(msg).toBe("Invalid syntax input");
      });
      test("400 - error when user input of page is invalid", async () => {
        const {
          body: { msg },
        } = await request(app)
          .get("/api/articles?limit=10&p=badrequest")
          .expect(400);
        expect(msg).toBe("Invalid syntax input");
      });
      test("404 - error when page input returns no articles", async () => {
        const {
          body: { msg },
        } = await request(app).get("/api/articles?limit=10&p=10").expect(404);
        expect(msg).toBe("Maximum Page(s) = 2");
      });
    });
  });
  describe("POST/api/articles", () => {
    test("201 - status response and return object of length 1", async () => {
      const articlePosted = {
        author: "lurker",
        title: "test article",
        body: "this is the body of the test article",
        topic: "paper",
      };
      const { body } = await request(app)
        .post("/api/articles")
        .send(articlePosted)
        .expect(201);
      expect(Object.keys(body)).toHaveLength(1);
    });
    test("201 - returns object with correct properties", async () => {
      const articlePosted = {
        author: "lurker",
        title: "test article",
        body: "this is the body of the test article",
        topic: "paper",
      };
      const {
        body: { article },
      } = await request(app)
        .post("/api/articles")
        .send(articlePosted)
        .expect(201);
      expect(article).toEqual({
        author: "lurker",
        title: "test article",
        body: "this is the body of the test article",
        topic: "paper",
        article_id: 13,
        votes: 0,
        created_at: expect.any(String),
        comment_count: "0",
      });
    });
    test("400 - error if sent object is invalid", async () => {
      const badPost = { badpost: "bad post" };
      const {
        body: { msg },
      } = await request(app).post("/api/articles").send(badPost).expect(400);
      expect(msg).toBe("Invalid input by user");
    });
    test("404 - error if author in sent object is not found", async () => {
      const nonUser = {
        author: "non_user",
        title: "test article",
        body: "this is the body of the test article",
        topic: "paper",
      };
      const {
        body: { msg },
      } = await request(app).post("/api/articles").send(nonUser).expect(404);
      expect(msg).toBe("User input of value does not exist");
    });
    test("404 - error if topic in sent object is not found", async () => {
      const nonTopic = {
        author: "lurker",
        title: "test article",
        body: "this is the body of the test article",
        topic: "non_topic",
      };
      const {
        body: { msg },
      } = await request(app).post("/api/articles").send(nonTopic).expect(404);
      expect(msg).toBe("User input of value does not exist");
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
          comment_count: "11",
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
      expect(msg).toBe("Invalid input by user");
    });
  });
  describe("DELETE/api/articles/:article_id", () => {
    test("204 - returns 204 status and no return body", async () => {
      const deleted = await request(app).delete("/api/articles/1").expect(204);
      expect(deleted.hasOwnProperty("body")).toEqual(false);
    });
    test("404 - returns error when article_id doesn't exist", async () => {
      const {
        body: { msg },
      } = await request(app).delete("/api/articles/999").expect(404);
      expect(msg).toBe("article_id does not exist");
    });
    test("400 - returns error when article_id is in invalid format", async () => {
      const {
        body: { msg },
      } = await request(app).delete("/api/articles/badrequest").expect(400);
      expect(msg).toBe("Invalid syntax input");
    });
  });
  describe("POST/api/articles/:article_id/comments", () => {
    test("201 - status message and returns posted comment", async () => {
      const {
        body: { comment },
      } = await request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "this is a user comment" })
        .expect(201);
      expect(comment).toEqual({
        comment_id: 19,
        body: "this is a user comment",
        votes: 0,
        author: "butter_bridge",
        article_id: 1,
        created_at: expect.any(String),
      });
    });
    test("400 - error if article_id is valid, but object posted is invalid format", async () => {
      const invalidPost = { badpost: "bad post" };
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/1/comments")
        .send(invalidPost)
        .expect(400);
      expect(msg).toBe("Invalid input by user");
    });
    test("400 - error if object posted is valid, but article_id in string query is invalid format", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/banana/comments")
        .send({ username: "butter_bridge", body: "this is a user comment" })
        .expect(400);
      expect(msg).toBe("Invalid syntax input");
    });
    test("404 - error if username does not exist", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/1/comments")
        .send({ username: "non_user", body: "this is a user comment" })
        .expect(404);
      expect(msg).toBe("User input of value does not exist");
    });
  });
  describe("GET/api/articles/:article_id/comments", () => {
    describe("default functionality", () => {
      test("200 - returns 200 status and an array", async () => {
        const {
          body: { comments },
        } = await request(app).get("/api/articles/1/comments").expect(200);
        expect(Array.isArray(comments)).toBe(true);
      });
      test("200 - returns array of the correct length", async () => {
        const {
          body: { comments },
        } = await request(app)
          .get("/api/articles/1/comments?limit=20")
          .expect(200);
        expect(comments).toHaveLength(11);
      });
      test("200 - each array object has the correct properties", async () => {
        const {
          body: { comments },
        } = await request(app).get("/api/articles/1/comments").expect(200);
        comments.forEach((comment) => {
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
        const {
          body: { comments },
        } = await request(app).get("/api/articles/2/comments").expect(200);
        expect(comments).toHaveLength(0);
      });
      test("404 - returns error when article_id doesn't exist", async () => {
        const {
          body: { msg },
        } = await request(app).get("/api/articles/99/comments").expect(404);
        expect(msg).toBe("user input 99 not found");
      });
      test("400 - returns error when article_id is invalid", async () => {
        const {
          body: { msg },
        } = await request(app).get("/api/articles/grapes/comments").expect(400);
        expect(msg).toBe("Invalid syntax input");
      });
    });
    describe("optional query - paginated queries", () => {
      test("200 - returns 200 Status", async () => {
        await request(app)
          .get("/api/articles/1/comments?limit=3&p=1")
          .expect(200);
      });
      test("200 - default limit of 10 comments returned", async () => {
        const {
          body: { comments },
        } = await request(app).get("/api/articles/1/comments").expect(200);
        expect(comments).toHaveLength(10);
      });
      test("200 - limit of comments can be changed", async () => {
        const {
          body: { comments },
        } = await request(app)
          .get("/api/articles/1/comments?limit=5")
          .expect(200);
        expect(comments).toHaveLength(5);
      });
      test("200 - page can also be set", async () => {
        const {
          body: { comments },
        } = await request(app)
          .get("/api/articles/1/comments?limit=2&p=2")
          .expect(200);
        expect(comments).toEqual([
          {
            comment_id: 13,
            votes: 0,
            created_at: "2020-06-15T10:25:00.000Z",
            author: "icellusedkars",
            body: "Fruit pastilles",
          },
          {
            comment_id: 12,
            votes: 0,
            created_at: "2020-03-02T07:10:00.000Z",
            author: "icellusedkars",
            body: "Massive intercranial brain haemorrhage",
          },
        ]);
      });
      test("200 - new total_count property ignores list limit", async () => {
        const {
          body: { total_count },
        } = await request(app)
          .get("/api/articles/1/comments?limit=5&p=2")
          .expect(200);
        expect(total_count).toBe(11);
      });
      test("400 - error when user input of limit is invalid", async () => {
        const {
          body: { msg },
        } = await request(app)
          .get("/api/articles/1/comments?limit=badrequest")
          .expect(400);
        expect(msg).toBe("Invalid syntax input");
      });
      test("400 - error when user input of page is invalid", async () => {
        const {
          body: { msg },
        } = await request(app)
          .get("/api/articles/1/comments?limit=10&p=badrequest")
          .expect(400);
        expect(msg).toBe("Invalid syntax input");
      });
      test("404 - error when page input returns no articles", async () => {
        const {
          body: { msg },
        } = await request(app)
          .get("/api/articles/1/comments?limit=10&p=10")
          .expect(404);
        expect(msg).toBe("Maximum Page(s) = 2");
      });
    });
  });
});
describe("/comments", () => {
  describe("DELETE/api/comments/:comment_id", () => {
    test("204 - returns 204 status and no return body", async () => {
      const empty = await request(app).delete("/api/comments/1").expect(204);
      expect(empty.hasOwnProperty("body")).toEqual(false);
    });
    test("404 - returns error when comment_id doesn't exist", async () => {
      const {
        body: { msg },
      } = await request(app).delete("/api/comments/999").expect(404);
      expect(msg).toBe("comment_id does not exist");
    });
    test("400 - returns error when user input of comment_id is invalid", async () => {
      const {
        body: { msg },
      } = await request(app).delete("/api/comments/banana").expect(400);
      expect(msg).toBe("Invalid syntax input");
    });
  });
  describe("PATCH/api/comments/:comment_id", () => {
    test("201 - returns 201 status", async () => {
      const votes = { inc_votes: 1 };
      await request(app).patch("/api/comments/1").send(votes).expect(201);
    });
    test("201 - updates vote count when positive value input", async () => {
      const votes = { inc_votes: 1 };
      const {
        body: { comment },
      } = await request(app).patch("/api/comments/1").send(votes).expect(201);
      expect(comment.votes).toBe(17);
    });
    test("201 - updates vote count when negative value input", async () => {
      const votes = { inc_votes: -10 };
      const {
        body: { comment },
      } = await request(app).patch("/api/comments/1").send(votes).expect(201);
      expect(comment.votes).toBe(6);
    });
    test("201 - return comment object has correct properties", async () => {
      const votes = { inc_votes: 1 };
      const {
        body: { comment },
      } = await request(app).patch("/api/comments/1").send(votes).expect(201);
      expect(comment).toEqual(
        expect.objectContaining({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        })
      );
    });
    test("400 - error returned when invalid vote value used", async () => {
      const invalidVote = { inc_votes: "banana" };
      const {
        body: { msg },
      } = await request(app)
        .patch("/api/comments/1")
        .send(invalidVote)
        .expect(400);
      expect(msg).toBe("Invalid syntax input");
    });
    test("400 - error when invalid patch request attempted", async () => {
      const invalidPatch = { badPatch: "badPatch" };
      const {
        body: { msg },
      } = await request(app)
        .patch("/api/comments/1")
        .send(invalidPatch)
        .expect(400);
      expect(msg).toBe("Invalid input by user");
    });
  });
});
