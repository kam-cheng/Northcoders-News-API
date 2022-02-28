const { fetchEndpoints } = require("../models/app.models.js");

exports.getEndpoints = async (req, res) => {
  const endpoints = await fetchEndpoints();
  res.status(200).send({ endpoints });
};
