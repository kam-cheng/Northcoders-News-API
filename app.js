const express = require("express");
const app = express();
const {
  getTopics,
  getArticles,
  getArticleById,
} = require("./controllers/app.controllers");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path does not exist" });
});

//custom errors
app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
});

//PSQL errors
app.use((err, req, res, next) => {
  if (err.code === "22P02")
    res.status(400).send({ msg: "Invalid input of article_id" });
  else next(err);
});

//Server error
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error!");
});

// only required for live servers
// app.listen(9000, () => {
//   console.log("Server listening on port 9000");
// });

module.exports = app;
