const { CASES } = require("./case.model");

const meetingOfCurrentMonth = async (req, res) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startOfMonth = new Date(Date.UTC(year, month, 1));
  const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

  try {
    const meetings = await CASES.aggregate([
      {
        $unwind: "$meetings",
      },
      {
        $addFields: {
          meetingStartUTC: { $toDate: "$meetings.start" },
        },
      },
      {
        $match: {
          meetingStartUTC: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $project: {
          _id: 0,
          caseId: 1,
          "meetings.webLink": 1,
          "meetings.start": 1,
          "meetings.end": 1,
        },
      },
      {
        $sort: { "meetings.start": 1 },
      },
    ]);
    res.status(200).json({ data: meetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ message: "Failed to fetch meetings" });
  }
};

module.exports = { meetingOfCurrentMonth };
