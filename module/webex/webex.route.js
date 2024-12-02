const {
  initializeToken,
  createMeeting,
  ensureValidToken,
  createMeetingforBulk,
} = require("./webex.controller");

const webexRouter = require("express").Router();

webexRouter.post("/initialize-token", initializeToken);

webexRouter.post("/create-meeting", ensureValidToken, createMeeting);

webexRouter.post(
  "/create-meeting-bulk",
  ensureValidToken,
  createMeetingforBulk
);

module.exports = webexRouter;
