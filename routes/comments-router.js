const commentRouter = require("express").Router();
const {
  deleteComment,
  updateCommentVotes,
} = require("../controllers/comments.controllers");

commentRouter.delete("/:comment_id", deleteComment);
commentRouter.patch("/:comment_id", updateCommentVotes);

module.exports = commentRouter;
