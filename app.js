const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const { customErrors, psqlErrors, serverErrors } = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path does not exist" });
});
app.use(customErrors);
app.use(psqlErrors);
app.all(serverErrors);

module.exports = app;
