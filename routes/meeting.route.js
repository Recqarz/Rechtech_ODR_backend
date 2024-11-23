const { createMeetings, getRecordings } = require("../controllers/meeting.controller");

const meetingRoute = require("express").Router();

meetingRoute.post("/", createMeetings);

meetingRoute.get("/recording", getRecordings);

module.exports = { meetingRoute };
