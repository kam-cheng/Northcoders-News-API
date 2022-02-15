const {
  fetchTopics,
  fetchArticles,
  fetchUsers,
} = require("../models/app.models.js");

exports.getTopics = async (req, res) => {
  const topics = await fetchTopics();
  res.status(200).send({ topics });
};

exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by: sortBy, order, topic } = req.query;
    const articles = await fetchArticles(sortBy, order, topic);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res) => {
  const users = await fetchUsers();
  res.status(200).send({ users });
};
