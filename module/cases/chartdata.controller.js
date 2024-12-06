const { CASES } = require("./case.model");

const chartData = async (req, res) => {
  try {
    const currentDate = new Date();
    const fourWeeksAgo = new Date(
      currentDate.setDate(currentDate.getDate() - 28)
    );
    const rawData = await CASES.aggregate([
      {
        $match: {
          createdAt: { $gte: fourWeeksAgo },
        },
      },
      {
        $project: {
          clientName: 1,
          caseId: 1,
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: {
            week: { $week: "$createdAt" },
            year: { $year: "$createdAt" },
            clientName: "$clientName",
          },
          caseCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
      {
        $group: {
          _id: { year: "$_id.year", week: "$_id.week" },
          clients: {
            $push: {
              clientName: "$_id.clientName",
              caseCount: "$caseCount",
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
    ]);
    const firstWeekClients = new Set();
    const transformedData = rawData.map((weekData, index) => {
      const weekObj = { week: `WEEK ${index + 1}` };
      if (index === 0) {
        weekData.clients.forEach((client) => {
          firstWeekClients.add(client.clientName);
        });
      }
      const allClients = [];
      weekData.clients.forEach((client) => {
        if (firstWeekClients.has(client.clientName)) {
          allClients.push(client);
        }
      });
      firstWeekClients.forEach((clientName) => {
        if (!allClients.some((client) => client.clientName === clientName)) {
          allClients.push({ clientName, caseCount: 0 });
        }
      });
      const topClients = allClients
        .sort((a, b) => b.caseCount - a.caseCount)
        .slice(0, 3);

      topClients.forEach((client) => {
        weekObj[client.clientName] = client.caseCount;
      });
      return weekObj;
    });

    return res.json(transformedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: "Error fetching data" });
  }
};

module.exports = { chartData };
