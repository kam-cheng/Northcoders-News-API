const {
  fetchTopics,
  fetchArticles,
  fetchUsers,
  updateVotes,
} = require("../models/app.models.js");

exports.getTopics = async (req, res) => {
  const topics = await fetchTopics();
  res.status(200).send({ topics });
};

exports.getArticles = async (req, res) => {
  const articles = await fetchArticles();
  res.status(200).send({ articles });
};

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id: articleId } = req.params;
    const article = await fetchArticles(articleId);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res) => {
  const users = await fetchUsers();
  res.status(200).send({ users });
};

exports.patchVotes = async (req, res, next) => {
  const { inc_votes: votes } = req.body;
  const { article_id: articleId } = req.params;
  try {
    const updatedVotes = await updateVotes(articleId, votes);
    res.status(202).send({ updatedVotes });
  } catch (err) {
    next(err);
  }
};
