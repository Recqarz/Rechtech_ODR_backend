require("dotenv").config();
const { default: axios } = require("axios");
const GlobalToken = require("./webex.model");
const { CASES } = require("../cases/case.model");
const {
  notificationForMeetingSchedule,
} = require("../../services/senEmailwithLinkandTime");
const schedule = require("node-schedule");
const {
  sendEmailtoArbitratorWithRecording,
  sendEmailtoClientWithRecording,
  sendEmailtoRespondentWithRecording,
} = require("../../services/sendEmailWithRecording");
const MAX_RETRIES = 4;

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
// Schedule Meeting
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
    const ncases = await cases.save();
    notificationForMeetingSchedule(
      ncases,
      response.data.webLink,
      startTime,
      endTime
    );
    scheduleJobForRecording(response.data.id, caseId, response.data.end);
    return res.status(201).send(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Failed to create meeting",
      details: err.response?.data || err.message,
    });
  }
};

const scheduleJobForRecordingBulk = (meetingId, caseId, meetingEndTime) => {
  const meetingEnd = new Date(meetingEndTime);
  const firstRetryTime = new Date(meetingEnd);
  firstRetryTime.setDate(firstRetryTime.getDate() + 1);
  firstRetryTime.setHours(0, 10, 0, 0);
  let retryCount = 0;
  const scheduleNextRetry = (retryTime) => {
    console.log(
      `Scheduling retry #${
        retryCount + 1
      } for meetingId: ${meetingId} at ${retryTime}`
    );
    const job = schedule.scheduleJob(
      `${meetingId}_retry_${retryCount}`,
      retryTime,
      async () => {
        console.log(
          `Running retry #${retryCount + 1} for meetingId: ${meetingId}`
        );
        const recording = await fetchRecording(meetingId);

        if (recording) {
          for (let i = 0; i < caseId.length; i++) {
            const cases = await CASES.findById(caseId[i]);
            cases.recordings.push(recording);
            await cases.save();
          }
          const cases = await CASES.findById(caseId[0]);
          sendEmailtoArbitratorWithRecording(cases, recording);
          job.cancel();
        } else {
          retryCount++;
          if (retryCount < MAX_RETRIES) {
            const nextRetryTime = new Date(
              retryTime.getTime() + 60 * 60 * 1000
            );
            scheduleNextRetry(nextRetryTime);
          } else {
            console.log(
              `Recording not available for meetingId: ${meetingId} after ${MAX_RETRIES} retries. Giving up.`
            );
            job.cancel();
          }
        }
      }
    );
  };
  scheduleNextRetry(firstRetryTime);
};

// Schedule Meeting for bulk
const createMeetingforBulk = async (req, res) => {
  const { caseId, startTime, endTime, title } = req.body;
  try {
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
    for (let i = 0; i < caseId.length; i++) {
      const cases = await CASES.findById(caseId[i]);
      cases.meetings.push(response.data);
      const ncases = await cases.save();
      notificationForMeetingSchedule(
        ncases,
        response.data.webLink,
        startTime,
        endTime
      );
    }
    scheduleJobForRecordingBulk(response.data.id, caseId, response.data.end);
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

async function ensureValidTokenforRecording() {
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
    return tokenData.accessToken;
  } catch (err) {
    console.error(err);
    return null;
  }
}

const fetchRecording = async (meetingId) => {
  const WEBEX_ACCESS_TOKEN = await ensureValidTokenforRecording();
  try {
    const response = await axios.get(`https://webexapis.com/v1/recordings`, {
      headers: {
        Authorization: `Bearer ${WEBEX_ACCESS_TOKEN}`,
      },
      params: {
        meetingId,
      },
    });

    return response.data.items[0];
  } catch (error) {
    console.error(
      `Error fetching recording for meetingId: ${meetingId}`,
      error.message
    );
    return null;
  }
};

const scheduleJobForRecording = (meetingId, caseId, meetingEndTime) => {
  const meetingEnd = new Date(meetingEndTime);
  const firstRetryTime = new Date(meetingEnd);
  firstRetryTime.setDate(firstRetryTime.getDate() + 1);
  firstRetryTime.setHours(0, 10, 0, 0);
  let retryCount = 0;
  const scheduleNextRetry = (retryTime) => {
    console.log(
      `Scheduling retry #${
        retryCount + 1
      } for meetingId: ${meetingId} at ${retryTime}`
    );
    const job = schedule.scheduleJob(
      `${meetingId}_retry_${retryCount}`,
      retryTime,
      async () => {
        console.log(
          `Running retry #${retryCount + 1} for meetingId: ${meetingId}`
        );
        const recording = await fetchRecording(meetingId);

        if (recording) {
          let cases = await CASES.findById(caseId);
          cases.recordings.push(recording);
          await cases.save();
          sendEmailtoArbitratorWithRecording(cases, recording);
          sendEmailtoClientWithRecording(cases, recording);
          sendEmailtoRespondentWithRecording(cases, recording);
          console.log(`Recording saved for meetingId: ${meetingId}`);
          job.cancel();
        } else {
          retryCount++;
          if (retryCount < MAX_RETRIES) {
            const nextRetryTime = new Date(
              retryTime.getTime() + 60 * 60 * 1000
            );
            scheduleNextRetry(nextRetryTime);
          } else {
            console.log(
              `Recording not available for meetingId: ${meetingId} after ${MAX_RETRIES} retries. Giving up.`
            );
            job.cancel();
          }
        }
      }
    );
  };
  scheduleNextRetry(firstRetryTime);
};

module.exports = {
  createMeeting,
  initializeToken,
  ensureValidToken,
  updateMeetStatus,
  createMeetingforBulk,
};
