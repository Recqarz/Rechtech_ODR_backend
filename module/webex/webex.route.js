const {
  initializeToken,
  createMeeting,
  ensureValidToken,
} = require("./webex.controller");

const webexRouter = require("express").Router();

webexRouter.post("/initialize-token", initializeToken);

webexRouter.post("/create-meeting", ensureValidToken, createMeeting);

module.exports = webexRouter;
