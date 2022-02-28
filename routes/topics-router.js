const topicRouter = require("express").Router();
const { getTopics, postTopic } = require("../controllers/topics.controllers");

topicRouter.get("/", getTopics);
topicRouter.post("/", postTopic);

module.exports = topicRouter;
