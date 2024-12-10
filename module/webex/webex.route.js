const { recentMeeting, fullMeetingDataWithCaseDetails, allMeetigs } = require("./recentwebex.controller");
const {
  initializeToken,
  createMeeting,
  ensureValidToken,
  createMeetingforBulk,
} = require("./webex.controller");

const webexRouter = require("express").Router();

webexRouter.post("/initialize-token", initializeToken);

webexRouter.post("/create-meeting", ensureValidToken, createMeeting);

webexRouter.get("/recent-meetings", recentMeeting);

webexRouter.get("/recent-fullMeetingDataWithCaseDetails", fullMeetingDataWithCaseDetails);

webexRouter.get("/all-meetings", allMeetigs);

webexRouter.post(
  "/create-meeting-bulk",
  ensureValidToken,
  createMeetingforBulk
);

module.exports = webexRouter;
