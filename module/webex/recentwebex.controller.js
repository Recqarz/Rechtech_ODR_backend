const { CASES } = require("../cases/case.model");

const recentMeeting = async (req, res) => {
  try {
    const results = await CASES.aggregate([
      {
        $unwind: "$meetings",
      },
      {
        $project: {
          _id: 0,
          id: "$caseId",
          time: {
            $dateToString: {
              format: "%H:%M",
              date: {
                $dateFromString: {
                  dateString: "$meetings.start",
                },
              },
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
      const timeParts = meeting.time.split(":");
      let hours = parseInt(timeParts[0]);
      const minutes = timeParts[1];
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
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
    return res
      .status(500)
      .json({ message: "Error fetching formatted meeting data" });
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
          startTime: {
            $dateFromString: {
              dateString: "$meetings.start",
            },
          },
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

module.exports = { recentMeeting, fullMeetingDataWithCaseDetails };
