const { fetchTopics, fetchUsers } = require("../models/app.models.js");

exports.getTopics = async (req, res) => {
  const topics = await fetchTopics();
  res.status(200).send(topics);
};

exports.getUsers = async (req, res) => {
  const users = await fetchUsers();
  res.status(200).send(users);
};
