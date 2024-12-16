const { recentMeeting, fullMeetingDataWithCaseDetails, allMeetigs, recentMeetingArbitrator, fullMeetingDataWithCaseDetailsArbitrator, allMeetigsArbitrator, allMeetingsClient, allMeetingsRespondent, fullMeetingDataWithCaseDetailsClient } = require("./recentwebex.controller");
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

//Routes for Recent meeting for Admin in the dashboard
webexRouter.get("/recent-fullMeetingDataWithCaseDetails", fullMeetingDataWithCaseDetails);

//Routes for Recent meeting for arbitrator in the dashboard
webexRouter.get("/recent-fullMeetingDataWithCaseDetails/arbitrator", fullMeetingDataWithCaseDetailsArbitrator);

//Routes for Recent meeting for arbitrator in the dashboard
webexRouter.get("/recent-fullMeetingDataWithCaseDetails/client", fullMeetingDataWithCaseDetailsClient);

webexRouter.get("/all-meetings", allMeetigs);

webexRouter.get("/all-meetings/arbitrator", allMeetigsArbitrator);
// routes for client calender
webexRouter.get("/all-meetings/client", allMeetingsClient);
// routes for respondent calender
webexRouter.get("/all-meetings/respondent", allMeetingsRespondent);







webexRouter.post(
  "/create-meeting-bulk",
  ensureValidToken,
  createMeetingforBulk,
);

module.exports = webexRouter;
