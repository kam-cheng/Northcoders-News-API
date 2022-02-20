const { fetchArticles, updateVotes } = require("../models/articles.models");

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
