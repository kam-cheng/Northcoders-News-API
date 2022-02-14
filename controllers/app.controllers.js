const { fetchTopics } = require("../models/app.models.js");

exports.getTopics = async (req, res) => {
  const topics = await fetchTopics();
  res.status(200).send(topics);
};
