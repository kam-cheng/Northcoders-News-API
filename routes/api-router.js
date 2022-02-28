const apiRouter = require("express").Router();
const userRouter = require("./users-router");
const articleRouter = require("./articles-router");
const commentRouter = require("./comments-router");
const topicRouter = require("./topics-router");
const { getEndpoints } = require("../controllers/app.controllers");

apiRouter.get("/", getEndpoints);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
