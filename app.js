const express = require("express");
const app = express();
const { getTopics, getUsers } = require("./controllers/app.controllers");

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path does not exist" });
});
// only required for live servers
// app.listen(9000, () => {
//   console.log("Server listening on port 9000");
// });

module.exports = app;
