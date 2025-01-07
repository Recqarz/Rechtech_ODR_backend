const { CASES } = require("../cases/case.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// upcoming meeting for admin in the dashboard
const recentMeeting = async (req, res) => {
  try {
    const today = new Date();
    const kolkataOffset = 5.5 * 60 * 60 * 1000;
    const startOfDay = new Date(today.getTime() + kolkataOffset);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(today.getTime() + kolkataOffset);
    endOfDay.setUTCHours(23, 59, 59, 999);
    const results = await CASES.aggregate([
      {
        $unwind: "$meetings",
      },
      {
        $addFields: {
          meetingDate: {
            $dateFromString: {
              dateString: "$meetings.start",
            },
          },
        },
      },
      {
        $match: {
          meetingDate: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$caseId",
          meet: "$meetings.id",
          time: {
            $dateToString: {
              format: "%H:%M",
              date: "$meetingDate",
              timezone: "Asia/Kolkata",
            },
          },
          title: { $concat: ["Meeting ", "$caseId"] },
          link: "$meetings.webLink",
        },
      },
      {
        $sort: { time: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const formattedResults = results.map((meeting) => {
      const [hoursString, minutes] = meeting.time.split(":");
      let hours = parseInt(hoursString, 10);
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const formattedTime = `${hours}:${minutes} ${ampm}`;
      return {
        id: meeting.id,
        time: formattedTime,
        title: meeting.title,
        link: meeting.link,
      };
    });

    return res.status(200).json({ data: formattedResults });
  } catch (error) {
    console.error("Error fetching formatted meeting data:", error);
    return res.status(500).json({
      message: "Error fetching formatted meeting data",
    });
  }
};

//upcoming meeting for arbitrator in the dashboard
const recentMeetingArbitrator = async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    const today = new Date();
    const kolkataOffset = 5.5 * 60 * 60 * 1000;
    const startOfDay = new Date(today.getTime() + kolkataOffset);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(today.getTime() + kolkataOffset);
    endOfDay.setUTCHours(23, 59, 59, 999);
    const results = await CASES.aggregate([
      {
        $match: {
          arbitratorId: decoded.id,
        },
      },
      {
        $unwind: "$meetings",
      },
      {
        $addFields: {
          meetingDate: {
            $dateFromString: {
              dateString: "$meetings.start",
            },
          },
        },
      },
      {
        $match: {
          meetingDate: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$caseId",
          meet: "$meetings.id",
          time: {
            $dateToString: {
              format: "%H:%M",
              date: "$meetingDate",
              timezone: "Asia/Kolkata",
            },
          },
          title: { $concat: ["Meeting ", "$caseId"] },
          link: "$meetings.webLink",
        },
      },
      {
        $sort: { time: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const formattedResults = results.map((meeting) => {
      const [hoursString, minutes] = meeting.time.split(":");
      let hours = parseInt(hoursString, 10);
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const formattedTime = `${hours}:${minutes} ${ampm}`;
      return {
        id: meeting.id,
        time: formattedTime,
        title: meeting.title,
        link: meeting.link,
      };
    });

    return res.status(200).json({ data: formattedResults });
  } catch (error) {
    console.error("Error fetching formatted meeting data:", error);
    return res.status(500).json({
      message: "Error fetching formatted meeting data",
    });
  }
};

// upcoming meeting for client in the dashboard
const recentMeetingClient = async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    const today = new Date();
    const kolkataOffset = 5.5 * 60 * 60 * 1000;
    const startOfDay = new Date(today.getTime() + kolkataOffset);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(today.getTime() + kolkataOffset);
    endOfDay.setUTCHours(23, 59, 59, 999);
    const results = await CASES.aggregate([
      {
        $match: {
          clientId: decoded.id,
        },
      },
      {
        $unwind: "$meetings",
      },
      {
        $addFields: {
          meetingDate: {
            $dateFromString: {
              dateString: "$meetings.start",
            },
          },
        },
      },
      {
        $match: {
          meetingDate: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$caseId",
          meet: "$meetings.id",
          time: {
            $dateToString: {
              format: "%H:%M",
              date: "$meetingDate",
              timezone: "Asia/Kolkata",
            },
          },
          title: { $concat: ["Meeting ", "$caseId"] },
          link: "$meetings.webLink",
        },
      },
      {
        $sort: { time: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const formattedResults = results.map((meeting) => {
      const [hoursString, minutes] = meeting.time.split(":");
      let hours = parseInt(hoursString, 10);
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const formattedTime = `${hours}:${minutes} ${ampm}`;
      return {
        id: meeting.id,
        time: formattedTime,
        title: meeting.title,
        link: meeting.link,
      };
    });

    return res.status(200).json({ data: formattedResults });
  } catch (error) {
    console.error("Error fetching formatted meeting data:", error);
    return res.status(500).json({
      message: "Error fetching formatted meeting data",
    });
  }
};

// upcoming meeting for respondent in the dashboard

const recentMeetingRespondent = async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    const today = new Date();
    const kolkataOffset = 5.5 * 60 * 60 * 1000;
    const startOfDay = new Date(today.getTime() + kolkataOffset);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(today.getTime() + kolkataOffset);
    endOfDay.setUTCHours(23, 59, 59, 999);
    const results = await CASES.aggregate([
      {
        $match: {
          accountNumber: decoded.accountNumber,
        },
      },
      {
        $unwind: "$meetings",
      },
      {
        $addFields: {
          meetingDate: {
            $dateFromString: {
              dateString: "$meetings.start",
            },
          },
        },
      },
      {
        $match: {
          meetingDate: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$caseId",
          meet: "$meetings.id",
          time: {
            $dateToString: {
              format: "%H:%M",
              date: "$meetingDate",
              timezone: "Asia/Kolkata",
            },
          },
          title: { $concat: ["Meeting ", "$caseId"] },
          link: "$meetings.webLink",
        },
      },
      {
        $sort: { time: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const formattedResults = results.map((meeting) => {
      const [hoursString, minutes] = meeting.time.split(":");
      let hours = parseInt(hoursString, 10);
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const formattedTime = `${hours}:${minutes} ${ampm}`;
      return {
        id: meeting.id,
        time: formattedTime,
        title: meeting.title,
        link: meeting.link,
      };
    });

    return res.status(200).json({ data: formattedResults });
  } catch (error) {
    console.error("Error fetching formatted meeting data:", error);
    return res.status(500).json({
      message: "Error fetching formatted meeting data",
    });
  }
};



// Recent meeting for admin in the dashboard
const fullMeetingDataWithCaseDetails = async (req, res) => {
  try {
    const results = await CASES.aggregate([
      {
        $unwind: "$meetings",
      },
      {
        $project: {
          _id: 1,
          caseId: 1,
          clientName: 1,
          clientId: 1,
          clientEmail: 1,
          clientAddress: 1,
          clientMobile: 1,
          respondentName: 1,
          respondentAddress: 1,
          respondentEmail: 1,
          respondentMobile: 1,
          amount: 1,
          accountNumber: 1,
          cardNo: 1,
          disputeType: 1,
          isArbitratorAssigned: 1,
          isFileUpload: 1,
          fileName: 1,
          attachments: 1,
          recordings: 1,
          orderSheet: 1,
          awards: 1,
          arbitratorId: 1,
          arbitratorName: 1,
          arbitratorEmail: 1,
          isFirstHearingDone: 1,
          isSecondHearingDone: 1,
          isMeetCompleted: 1,
          isAwardCompleted: 1,
          isCaseResolved: 1,
          createdAt: 1,
          updatedAt: 1,
          meetingId: "$meetings.id",
          webLink: "$meetings.webLink",
          startTime: "$meetings.start",
        },
      },
      {
        $sort: { startTime: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return res.status(200).json({ data: results });
  } catch (error) {
    console.error("Error fetching full meeting data with case details:", error);
    return res
      .status(500)
      .json({ message: "Error fetching full meeting data with case details" });
  }
};

// Recent meeting for arbitrator in the dashboard
const fullMeetingDataWithCaseDetailsArbitrator = async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const results = await CASES.aggregate([
      {
        $match: {
          arbitratorId: decoded.id,
        },
      },
      {
        $unwind: "$meetings",
      },
      {
        $project: {
          _id: 1,
          caseId: 1,
          clientName: 1,
          clientId: 1,
          clientEmail: 1,
          clientAddress: 1,
          clientMobile: 1,
          respondentName: 1,
          respondentAddress: 1,
          respondentEmail: 1,
          respondentMobile: 1,
          amount: 1,
          accountNumber: 1,
          cardNo: 1,
          disputeType: 1,
          isArbitratorAssigned: 1,
          isFileUpload: 1,
          fileName: 1,
          attachments: 1,
          recordings: 1,
          orderSheet: 1,
          awards: 1,
          arbitratorId: 1,
          arbitratorName: 1,
          arbitratorEmail: 1,
          isFirstHearingDone: 1,
          isSecondHearingDone: 1,
          isMeetCompleted: 1,
          isAwardCompleted: 1,
          isCaseResolved: 1,
          createdAt: 1,
          updatedAt: 1,
          meetingId: "$meetings.id",
          webLink: "$meetings.webLink",
          startTime: "$meetings.start",
        },
      },
      {
        $sort: { startTime: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return res.status(200).json({ data: results });
  } catch (error) {
    console.error("Error fetching full meeting data with case details:", error);
    return res
      .status(500)
      .json({ message: "Error fetching full meeting data with case details" });
  }
};




// Recent meeting for client in the dashboard
const fullMeetingDataWithCaseDetailsClient = async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const results = await CASES.aggregate([
      {
        $match: {
          clientId: decoded.id,
        },
      },
      {
        $unwind: "$meetings",
      },
      {
        $project: {
          _id: 1,
          caseId: 1,
          clientName: 1,
          clientId: 1,
          clientEmail: 1,
          clientAddress: 1,
          clientMobile: 1,
          respondentName: 1,
          respondentAddress: 1,
          respondentEmail: 1,
          respondentMobile: 1,
          amount: 1,
          accountNumber: 1,
          cardNo: 1,
          disputeType: 1,
          isArbitratorAssigned: 1,
          isFileUpload: 1,
          fileName: 1,
          attachments: 1,
          recordings: 1,
          orderSheet: 1,
          awards: 1,
          arbitratorId: 1,
          arbitratorName: 1,
          arbitratorEmail: 1,
          isFirstHearingDone: 1,
          isSecondHearingDone: 1,
          isMeetCompleted: 1,
          isAwardCompleted: 1,
          isCaseResolved: 1,
          createdAt: 1,
          updatedAt: 1,
          meetingId: "$meetings.id",
          webLink: "$meetings.webLink",
          startTime: "$meetings.start",
        },
      },
      {
        $sort: { startTime: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return res.status(200).json({ data: results });
  } catch (error) {
    console.error("Error fetching full meeting data with case details:", error);
    return res
      .status(500)
      .json({ message: "Error fetching full meeting data with case details" });
  }
};


// Recent meeting for respondent in the dashboard

const fullMeetingDataWithCaseDetailsRespondent = async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const results = await CASES.aggregate([
      {
        $match: {
          accountNumber: decoded.accountNumber,
        },
      },
      {
        $unwind: "$meetings",
      },
      {
        $project: {
          _id: 1,
          caseId: 1,
          clientName: 1,
          clientId: 1,
          clientEmail: 1,
          clientAddress: 1,
          clientMobile: 1,
          respondentName: 1,
          respondentAddress: 1,
          respondentEmail: 1,
          respondentMobile: 1,
          amount: 1,
          accountNumber: 1,
          cardNo: 1,
          disputeType: 1,
          isArbitratorAssigned: 1,
          isFileUpload: 1,
          fileName: 1,
          attachments: 1,
          recordings: 1,
          orderSheet: 1,
          awards: 1,
          arbitratorId: 1,
          arbitratorName: 1,
          arbitratorEmail: 1,
          isFirstHearingDone: 1,
          isSecondHearingDone: 1,
          isMeetCompleted: 1,
          isAwardCompleted: 1,
          isCaseResolved: 1,
          createdAt: 1,
          updatedAt: 1,
          meetingId: "$meetings.id",
          webLink: "$meetings.webLink",
          startTime: "$meetings.start",
        },
      },
      {
        $sort: { startTime: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return res.status(200).json({ data: results });
  } catch (error) {
    console.error("Error fetching full meeting data with case details:", error);
    return res
      .status(500)
      .json({ message: "Error fetching full meeting data with case details" });
  }
};





// All Meetings for Admin in the Calender section
const allMeetigs = async (req, res) => {
  try {
    const cases = await CASES.aggregate([
      {
        $project: {
          caseId: 1,
          arbitratorName: 1,
          clientName: 1,
          respondentName: 1,
          disputeType: 1,
          meetings: {
            $map: {
              input: "$meetings",
              as: "meeting",
              in: {
                webLink: "$$meeting.webLink",
                start: "$$meeting.start",
                end: "$$meeting.end",
              },
            },
          },
        },
      },
      { $unwind: "$meetings" },
      { $sort: { "meetings.start": -1 } },
    ]);
    return res.status(200).json({ data: cases });
  } catch (error) {
    console.error("Error fetching all meetings:", error);
    return res.status(500).json({
      message: "Error fetching all meetings",
    });
  }
};


// All Meetings for Arbitrator in the Calender section
const allMeetigsArbitrator = async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const cases = await CASES.aggregate([
      {
        $match: {
          arbitratorId: decoded.id,
        },
      },
      {
        $project: {
          caseId: 1,
          arbitratorName: 1,
          clientName: 1,
          respondentName: 1,
          disputeType: 1,
          meetings: {
            $map: {
              input: "$meetings",
              as: "meeting",
              in: {
                webLink: "$$meeting.webLink",
                start: "$$meeting.start",
                end: "$$meeting.end",
              },
            },
          },
        },
      },
      { $unwind: "$meetings" },
      { $sort: { "meetings.start": -1 } },
    ]);
    return res.status(200).json({ data: cases });
  } catch (error) {
    console.error("Error fetching all meetings:", error);
    return res.status(500).json({
      message: "Error fetching all meetings",
    });
  }
};


// All Meetings for Clients in the Calender section
const allMeetingsClient = async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const cases=await CASES.aggregate([
      {
        $match: {
          clientId: decoded.id,
        },
      },
      {
        $project: {
          caseId: 1,
          arbitratorName: 1,
          clientName: 1,
          respondentName: 1,
          disputeType: 1,
          meetings: {
            $map: {
              input: "$meetings",
              as: "meeting",
              in: {
                webLink: "$$meeting.webLink",
                start: "$$meeting.start",
                end: "$$meeting.end",
              },
            },
          },
        },
      },
      { $unwind: "$meetings" },
      { $sort: { "meetings.start": -1 } },
    ])
    return res.status(200).json({ data: cases });
  } catch (error) {
    console.error("Error fetching all meetings:", error);
    return res.status(500).json({
      message: "Error fetching all meetings",
    });
  }
};


// All Meetings for Respondent in the Calender section
const allMeetingsRespondent = async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const cases=await CASES.aggregate([
      {
        $match: {
          accountNumber: decoded.accountNumber,
        },
      },
      {
        $project: {
          caseId: 1,
          arbitratorName: 1,
          clientName: 1,
          respondentName: 1,
          disputeType: 1,
          meetings: {
            $map: {
              input: "$meetings",
              as: "meeting",
              in: {
                webLink: "$$meeting.webLink",
                start: "$$meeting.start",
                end: "$$meeting.end",
              },
            },
          },
        },
      },
      { $unwind: "$meetings" },
      { $sort: { "meetings.start": -1 } },
    ])
    return res.status(200).json({ data: cases });
  } catch (error) {
    console.error("Error fetching all meetings:", error);
    return res.status(500).json({
      message: "Error fetching all meetings",
    });
  }
};





module.exports = {
  recentMeeting,
  fullMeetingDataWithCaseDetails,
  allMeetigs,
  recentMeetingArbitrator,
  fullMeetingDataWithCaseDetailsArbitrator,
  allMeetigsArbitrator,
 
  allMeetingsClient,
  allMeetingsRespondent,
  fullMeetingDataWithCaseDetailsClient,
  fullMeetingDataWithCaseDetailsRespondent,
  recentMeetingClient,
  recentMeetingRespondent,
};
