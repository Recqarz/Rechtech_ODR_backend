const { CASES } = require("../../cases/case.model");
const { USER } = require("../../users/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Get total completed arbitration, clients, and cases completed for the admin dashboard
const getTheCountOfAll = async (req, res) => {
  try {
    const arbitrator = await USER.countDocuments({ role: "arbitrator" });
    const client = await USER.countDocuments({ role: "client" });
    const cases = await CASES.countDocuments();
    return res.status(200).json({
      arbitrators: arbitrator,
      clients: client,
      cases: cases,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Get total completed arbitration, clients, and cases completed for the arbitrator dashboard
const getTheCountOfAllArbitrator = async (req, res) => {
  const { token } = req.headers;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const key = process.env.JWT_SECRET_KEY;
    let verification = jwt.verify(token?.split(" ")[1], key);
    if (!verification) return res.status(403).json({ message: "Forbidden" });
    const arbitration = await CASES.countDocuments({
      arbitratorId: verification.id,
      isMeetCompleted: true,
    });

    const uniqueClients = await CASES.aggregate([
      {
        $match: { arbitratorId: verification.id },
      },
      {
        $group: { _id: "$clientId" },
      },
      {
        $count: "uniqueClientCount",
      },
    ]);

    const uniqueClientscount =
      uniqueClients.length > 0 ? uniqueClients[0].uniqueClientCount : 0;
    const cases = await CASES.countDocuments({ arbitratorId: verification.id });
    const awards = await CASES.countDocuments({
      arbitratorId: verification.id,
      isAwardCompleted: true,
    });
    return res.status(200).json({
      arbitrations: arbitration,
      uniqueClients: uniqueClientscount,
      totalCases: cases,
      awards: awards,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Get total completed arbitration, clients, and cases completed for the client dashboard

const getTheCountOfAllClient = async (req, res) => {
  const { token } = req.headers;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const key = process.env.JWT_SECRET_KEY;
    let verification = jwt.verify(token?.split(" ")[1], key);
    if (!verification) return res.status(403).json({ message: "Forbidden" });

    //Arbitration completed
    const arbitration = await CASES.countDocuments({
      clientId: verification.id,
      isMeetCompleted: true,
    });

    // Total Clients
    let clientCount = await USER.countDocuments({ role: "client" });

    //Case completed
    const casesCompleted = await CASES.countDocuments({
      clientId: verification.id,
      isCaseResolved: true,
    });

    //Award completed
    const awards = await CASES.countDocuments({
      clientId: verification.id,
      isAwardCompleted: true,
    });
    return res.status(200).json({
      arbitrations: arbitration,
      uniqueClients: clientCount,
      totalCases: casesCompleted,
      awards: awards,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = {
  getTheCountOfAll,
  getTheCountOfAllArbitrator,
  getTheCountOfAllClient,
};
