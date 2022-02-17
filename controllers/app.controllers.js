const {
  fetchTopics,
  fetchArticles,
  fetchUsers,
  updateVotes,
  addComment,
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

exports.postComment = async (req, res, next) => {
  const { username: author, body } = req.body;
  const { article_id: articleId } = req.params;
  try {
    const comment = await addComment(articleId, author, body);
    res.status(201).send({ comment });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
