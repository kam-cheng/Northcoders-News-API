//custom errors
exports.customErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

//PSQL errors
exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02")
    res.status(400).send({ msg: "Invalid input of article_id" });
  else next(err);
};

//Server error
exports.serverErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error!");
};