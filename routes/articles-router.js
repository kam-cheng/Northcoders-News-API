const articleRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchVotes,
} = require("../controllers/articles.controllers");
const {
  postComment,
  getArticleIdComments,
} = require("../controllers/comments.controllers");

articleRouter.get("/", getArticles);
articleRouter.route("/:article_id").get(getArticleById).patch(patchVotes);
articleRouter
  .route("/:article_id/comments")
  .get(getArticleIdComments)
  .post(postComment);

module.exports = articleRouter;
