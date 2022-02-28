const { fetchTopics, addTopic } = require("../models/topics.models");

exports.getTopics = async (req, res) => {
  const topics = await fetchTopics();
  res.status(200).send({ topics });
};

exports.postTopic = async (req, res, next) => {
  const { slug, description } = req.body;
  try {
    const topic = await addTopic(slug, description);
    res.status(201).send({ topic });
  } catch (err) {
    next(err);
  }
};
