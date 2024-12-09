const { meetingOfCurrentMonth } = require("./case.calendar.controller");

const calendarRoute = require("express").Router();

calendarRoute.get("/meetingofcurrentmonth", meetingOfCurrentMonth);

module.exports = { calendarRoute };
