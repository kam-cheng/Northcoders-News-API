const articleRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchVotes,
  postArticle,
} = require("../controllers/articles.controllers");
const {
  postComment,
  getArticleIdComments,
} = require("../controllers/comments.controllers");

articleRouter.route("/").get(getArticles).post(postArticle);
articleRouter.route("/:article_id").get(getArticleById).patch(patchVotes);
articleRouter
  .route("/:article_id/comments")
  .get(getArticleIdComments)
  .post(postComment);

module.exports = articleRouter;
