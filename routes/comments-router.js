const commentRouter = require("express").Router();
const {
  deleteComment,
  updateCommentVotes,
} = require("../controllers/comments.controllers");

commentRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .patch(updateCommentVotes);

module.exports = commentRouter;
