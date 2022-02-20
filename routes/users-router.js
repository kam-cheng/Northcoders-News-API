const userRouter = require("express").Router();
const { getUsers, getUsername } = require("../controllers/users.controllers");

userRouter.get("/", getUsers);
userRouter.get("/:username", getUsername);

module.exports = userRouter;
