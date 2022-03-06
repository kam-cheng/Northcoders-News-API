const {
  addComment,
  deleteCommentId,
  fetchArticleIdComments,
  updateCommentIdVotes,
} = require("../models/comments.models");

exports.postComment = async (req, res, next) => {
  const { username: author, body } = req.body;
  const { article_id: articleId } = req.params;
  try {
    const comment = await addComment(articleId, author, body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};
exports.getArticleIdComments = async (req, res, next) => {
  const { article_id: articleId } = req.params;
  const { limit, p } = req.query;
  try {
    const comments = await fetchArticleIdComments({ articleId, limit, p });
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
exports.updateCommentVotes = async (req, res, next) => {
  const { inc_votes: votes } = req.body;
  const { comment_id: commentId } = req.params;
  try {
    const comment = await updateCommentIdVotes(commentId, votes);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};
