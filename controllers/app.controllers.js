const { fetchTopics, fetchArticles. fetchUsers } = require("../models/app.models.js");

exports.getTopics = async (req, res) => {
  const topics = await fetchTopics();
  res.status(200).send({ topics });
};

exports.getArticles = async (req, res) => {
  const articles = await fetchArticles();
  res.status(200).send({ articles });
};

exports.getUsers = async (req, res) => {
  const users = await fetchUsers();
  res.status(200).send({ users });
};
