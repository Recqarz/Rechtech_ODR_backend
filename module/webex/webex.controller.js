require("dotenv").config();
const { default: axios } = require("axios");
const GlobalToken = require("./webex.model");
const { CASES } = require("../cases/case.model");
const { notificationForMeetingSchedule } = require("../../services/senEmailwithLinkandTime");
// const {
//   senEmailwithLinkandTime,
// } = require("../../services/senEmailwithLinkandTime");

async function refreshGlobalAccessToken() {
  const tokenData = await GlobalToken.findOne();

  if (!tokenData) {
    throw new Error("Global token not initialized");
  }

  try {
    const response = await axios.post(process.env.TOKEN_ENDPOINT, null, {
      params: {
        grant_type: "refresh_token",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: tokenData.refreshToken,
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;

    tokenData.accessToken = access_token;
    tokenData.refreshToken = refresh_token || tokenData.refreshToken;
    tokenData.expiresAt = new Date(Date.now() + expires_in * 1000);
    await tokenData.save();

    return access_token;
  } catch (err) {
    console.error("Error refreshing token:", err.response?.data || err.message);
    throw new Error("Failed to refresh global access token");
  }
}

async function ensureValidToken(req, res, next) {
  try {
    let tokenData = await GlobalToken.findOne();

    if (!tokenData) {
      return res.status(500).send({ error: "Global token not initialized" });
    }

    if (new Date() > tokenData.expiresAt) {
      console.log("Access token expired. Refreshing...");
      await refreshGlobalAccessToken();
      tokenData = await GlobalToken.findOne();
    }

    req.globalAccessToken = tokenData.accessToken;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to ensure valid token" });
  }
}

const initializeToken = async (req, res) => {
  const { code } = req.body;

  try {
    const data = `grant_type=authorization_code&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&state=set_state_here&redirect_uri=${process.env.REDIRECT_URI}`;
    const config = {
      method: "post",
      url: "https://webexapis.com/v1/access_token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    const response = await axios(config);
    const { access_token, refresh_token, expires_in } = response.data;
    await GlobalToken.deleteMany({});
    const tokenData = new GlobalToken({
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: new Date(Date.now() + expires_in * 1000),
    });
    await tokenData.save();
    res.status(201).send({ message: "Global token initialized successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to initialize global token" });
  }
};

const createMeeting = async (req, res) => {
  const { caseId, startTime, endTime, title } = req.body;
  try {
    const cases = await CASES.findById(caseId);
    const response = await axios.post(
      process.env.CREATE_MEETING_ENDPOINT,
      {
        title,
        start: startTime,
        end: endTime,
        enabledAutoRecordMeeting: true,
        timezone: "Asia/Kolkata",
        enabledJoinBeforeHost: false,
        unlockedMeetingJoinSecurity: "allowJoinWithLobby",
        enableAutomaticLock: true,
        automaticLockMinutes: 0,
        allowFirstUserToBeCoHost: false,
        allowFirstUserToBeCoHost: false,
        enabledBreakoutSessions: true,
        recordingEnabled: true,
      },
      {
        headers: {
          Authorization: `Bearer ${req.globalAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    cases.meetings.push(response.data);
    await cases.save();
    // senEmailwithLinkandTime(cases, response.data.webLink, startTime, endTime);
    notificationForMeetingSchedule(cases, response.data.webLink, startTime, endTime)
    return res.status(201).send(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Failed to create meeting",
      details: err.response?.data || err.message,
    });
  }
};

const updateMeetStatus = async (req, res) => {
  const { id } = req.body;
  try {
    const cases = await CASES.findById(id);
    cases.isMeetCompleted = true;
    await cases.save();
    return res
      .status(200)
      .send({ message: "Meeting status updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Failed to update meeting status",
      details: err.response?.data || err.message,
    });
  }
};

const getRecorings = async (req, res) => {
  const { meetingId } = req.params;
  try {
  } catch (err) {
    res.status(500).send({
      error: "Failed to get recorings",
      details: err.response?.data || err.message,
    });
  }
};

module.exports = { createMeeting, initializeToken, ensureValidToken, updateMeetStatus };
