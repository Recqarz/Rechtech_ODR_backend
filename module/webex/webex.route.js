const { recentMeeting, fullMeetingDataWithCaseDetails, allMeetigs, recentMeetingArbitrator, fullMeetingDataWithCaseDetailsArbitrator, allMeetigsArbitrator } = require("./recentwebex.controller");
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

webexRouter.get("/recent-meetings/arbitrator", recentMeetingArbitrator);

webexRouter.get("/recent-fullMeetingDataWithCaseDetails", fullMeetingDataWithCaseDetails);

webexRouter.get("/recent-fullMeetingDataWithCaseDetails/arbitrator", fullMeetingDataWithCaseDetailsArbitrator);

webexRouter.get("/all-meetings", allMeetigs);

webexRouter.get("/all-meetings/arbitrator", allMeetigsArbitrator);

webexRouter.post(
  "/create-meeting-bulk",
  ensureValidToken,
  createMeetingforBulk,
);

module.exports = webexRouter;
