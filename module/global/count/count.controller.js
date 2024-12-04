const { CASES } = require("../../cases/case.model");
const { USER } = require("../../users/user.model");

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

module.exports = { getTheCountOfAll };
