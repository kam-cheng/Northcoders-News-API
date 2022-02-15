const express = require("express");
const app = express();
const {
  getTopics,
  getUsers,
  getArticles,
} = require("./controllers/app.controllers");

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path does not exist" });
});
// only required for live servers
// app.listen(9000, () => {
//   console.log("Server listening on port 9000");
// });

module.exports = app;
