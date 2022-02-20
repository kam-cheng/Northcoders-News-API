const apiRouter = require("express").Router();
const userRouter = require("./users-router");
const articleRouter = require("./articles-router");
const commentRouter = require("./comments-router");
const { getEndpoints, getTopics } = require("../controllers/app.controllers");

apiRouter.get("/", getEndpoints);
apiRouter.get("/topics", getTopics);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
