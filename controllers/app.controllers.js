const {
  fetchTopics,
  fetchArticles,
  fetchUsers,
  updateVotes,
  fetchArticleIdComments,
  deleteCommentId,
  fetchEndpoints,
  fetchUsername,
} = require("../models/app.models.js");

exports.getEndpoints = async (req, res) => {
  const endpoints = await fetchEndpoints();
  res.status(200).send({ endpoints });
};

exports.getTopics = async (req, res) => {
  const topics = await fetchTopics();
  res.status(200).send({ topics });
};

exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by: sortBy, order, topic } = req.query;
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

exports.getUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await fetchUsername(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
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

exports.deleteComment = async (req, res, next) => {
  const { comment_id: commentId } = req.params;
  try {
    await deleteCommentId(commentId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
