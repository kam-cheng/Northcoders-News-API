//custom errors
exports.customErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

//PSQL errors
exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02")
    res.status(400).send({ msg: "Invalid syntax input" });
  if (err.code === "23502")
    res.status(400).send({ msg: "Invalid input by user" });
  if (err.code === "23503")
    res.status(404).send({ msg: "User input of value does not exist" });
  else next(err);
};

//Server error
exports.serverErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error!");
};
