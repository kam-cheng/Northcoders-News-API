const { fetchTopics, fetchEndpoints } = require("../models/app.models.js");

exports.getEndpoints = async (req, res) => {
  const endpoints = await fetchEndpoints();
  res.status(200).send({ endpoints });
};

exports.getTopics = async (req, res) => {
  const topics = await fetchTopics();
  res.status(200).send({ topics });
};
