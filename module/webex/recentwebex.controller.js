const { CASES } = require("../cases/case.model");

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
        $limit: 6,
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

module.exports = { recentMeeting, fullMeetingDataWithCaseDetails };
