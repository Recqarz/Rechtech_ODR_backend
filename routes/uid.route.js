const { USER } = require("../model/user.model");

const uidRoute = require("express").Router();

uidRoute.get("/client", async (req, res) => {
  try {
    let users = await USER.find({ role: "client" });
    let count = users.length+1;
    let paddedCount = count.toString().padStart(2, "0");
    let clientId = "CL" + paddedCount;
    return res.json({ uid: clientId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

uidRoute.get("/arbitrator", async (req, res) => {
  try {
    let users = await USER.find({ role: "arbitrator" });
    let count = users.length+1;
    let paddedCount = count.toString().padStart(2, "0");
    let clientId = "AR" + paddedCount;
    return res.json({ uid: clientId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { uidRoute };
