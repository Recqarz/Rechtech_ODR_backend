const { CASEDATA } = require("../model/caseData.model");
const { USER } = require("../model/user.model");
const { notificationtToall } = require("../services/notificationtoall");

const appointArbitratorandNotify = async (req, res) => {
  const { caseId, arbitrator, arbitratorId, arbitratorEmail } = req.body;
  try {
    const cases = await CASEDATA.findById(caseId);
    cases.arbitrator = arbitrator;
    cases.arbitratorId = arbitratorId;
    cases.arbitratorEmail = arbitratorEmail;
    const updatedCases = await cases.save();
    const user = await USER.findOne({ emailId: arbitratorEmail });
    let noOfAssignCase = parseInt(user.noOfAssignCase) + 1;
    await USER.findByIdAndUpdate(user._id, { noOfAssignCase }, { new: true });
    await notificationtToall(cases);
    return res.status(200).json({
      message: "Arbitrator Appointed and Notification sent successfully",
      updatedCases,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { appointArbitratorandNotify };
