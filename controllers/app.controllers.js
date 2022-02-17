const {
  fetchTopics,
  fetchArticles,
  fetchUsers,
  updateVotes,
  fetchArticleIdComments,
} = require("../models/app.models.js");

exports.getTopics = async (req, res) => {
  const topics = await fetchTopics();
  res.status(200).send({ topics });
};

exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by: sortBy, order, topic } = req.query;
    // const articles = await fetchArticles(sortBy, order, topic);
    const articles = await fetchArticles({ sortBy, order, topic });
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id: articleId } = req.params;
    const article = await fetchArticles({ articleId });
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
    const article = await updateVotes(articleId, votes);
    res.status(201).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getArticleIdComments = async (req, res, next) => {
  const { article_id: articleId } = req.params;
  try {
    const comments = await fetchArticleIdComments(articleId);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
