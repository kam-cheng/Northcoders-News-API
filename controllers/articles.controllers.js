const {
  fetchArticles,
  updateVotes,
  createArticle,
  deleteArticleId,
} = require("../models/articles.models");

exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by: sortBy, order, topic, limit, p } = req.query;
    const articles = await fetchArticles({ sortBy, order, topic, limit, p });
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.postArticle = async (req, res, next) => {
  const { author, title, body, topic } = req.body;
  try {
    const article = await createArticle(author, title, body, topic);
    res.status(201).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.deleteArticle = async (req, res, next) => {
  const { article_id: articleId } = req.params;
  try {
    await deleteArticleId(articleId);
    res.status(204).send();
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
