const express = require("express");
const app = express();
const {
  getTopics,
  getUsers,
  getArticles,
  getArticleById,
  patchVotes,
  postComment,
  getArticleIdComments,
} = require("./controllers/app.controllers");

const { customErrors, psqlErrors, serverErrors } = require("./errors");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchVotes);
app.post("/api/articles/:article_id/comments", postComment);
app.get("/api/articles/:article_id/comments", getArticleIdComments);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path does not exist" });
});

// only required for live servers
// app.listen(9000, () => {
//   console.log("Server listening on port 9000");
// });

app.use(customErrors);
app.use(psqlErrors);
app.all(serverErrors);

module.exports = app;
