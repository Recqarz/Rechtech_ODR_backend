require("dotenv").config();
const { default: axios } = require("axios");
const { CASEDATA } = require("../model/caseData.model");
const { saveTheLink } = require("../services/savelink");
const {
  senEmailwithLinkandTime,
} = require("../services/senEmailwithLinkandTime");

const createMeetings = async (req, res) => {
  const { caseId, startTime, endTime, title, description } = req.body;
  try {
    const cases = await CASEDATA.findById(caseId);
    let token = process.env.WEBEX_TOKEN;
    axios
      .post(
        "https://webexapis.com/v1/meetings",
        {
          meetingType: "meetingSeries",
          title,
          agenda: description,
          start: startTime,
          end: endTime,
          enabledAutoRecordMeeting: true,
          enabledJoinBeforeHost: false,
          unlockedMeetingJoinSecurity: "allowJoinWithLobby",
          enableAutomaticLock: true,
          automaticLockMinutes: 0,
          allowAnyUserToBeCoHost: false,
          allowFirstUserToBeCoHost: false,
          hostEmail: "vikram.choudhary@recqarz.com",
          enabledBreakoutSessions: true,
          timezone: "Asia/Kolkata",
          recordingEnabled: true,
          autoRecordType: "local",
          attendees: [
            {
              email: cases.arbitratorEmail,
              role: "coHost",
            },
          ],
        },
        {
          headers: {
            ContentType: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        saveTheLink(response.data.webLink, response.data.id, caseId);
        senEmailwithLinkandTime(
          cases,
          response.data.webLink,
          startTime,
          endTime
        );
        res.status(200).json({
          message: "Meeting created successfully",
          data: response.data,
        });
      })
      .catch((error) => {
        res.status(500).json({ message: "Internal Server Error" });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRecordings = async (req, res) => {
  try {
    let token = process.env.WEBEX_TOKEN;
    axios
      .get("https://webexapis.com/v1/recordings", {
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        res.status(200).json({
          message: "Meet Recordings",
          data: response.data,
        });
      })
      .catch((error) => {
        res.status(500).json({ message: "Internal Server Error" });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createMeetings, getRecordings };
