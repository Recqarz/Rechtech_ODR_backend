const { CASES } = require("../module/cases/case.model");
const { USER } = require("../module/users/user.model");
const {
  notificationToclientforcaseassign,
  notificationToarbitratorforcaseassign,
  notificationTorespondentforcaseassign,
} = require("../services/notificationtoall");

const appointArbitratorandNotify = async (req, res) => {
  const { id, arbitratorName, arbitratorId, arbitratorEmail } = req.body;
  try {
    const cases = await CASES.findById(id);
    cases.arbitratorName = arbitratorName;
    cases.arbitratorId = arbitratorId;
    cases.arbitratorEmail = arbitratorEmail;
    cases.isArbitratorAssigned = true;
    const updatedCases = await cases.save();
    const user = await USER.findOne({ emailId: arbitratorEmail });
    let noOfAssignCase = parseInt(user.noOfAssignCase) + 1;
    await USER.findByIdAndUpdate(user._id, { noOfAssignCase }, { new: true });
    notificationToarbitratorforcaseassign(updatedCases);
    notificationToclientforcaseassign(updatedCases);
    notificationTorespondentforcaseassign(updatedCases);
    return res.status(200).json({
      message: "Arbitrator Appointed and Notification sent successfully",
      updatedCases,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const appointArbitratorandNotifyBulk = async (req, res) => {
  const { data, arbitratorName, arbitratorId, arbitratorEmail } = req.body;
  let count = 0;
  try {
    for (const caseData of data) {
      const cases = await CASES.findById(caseData);
      if (!cases.isArbitratorAssigned) {
        cases.arbitratorName = arbitratorName;
        cases.arbitratorId = arbitratorId;
        cases.arbitratorEmail = arbitratorEmail;
        cases.isArbitratorAssigned = true;
        const updatedCases = await cases.save();
        notificationToarbitratorforcaseassign(updatedCases);
        notificationToclientforcaseassign(updatedCases);
        notificationTorespondentforcaseassign(updatedCases);
        count++;
      }
    }
    const user = await USER.findOne({ emailId: arbitratorEmail });
    let noOfAssignCase = parseInt(user.noOfAssignCase) + count;
    await USER.findByIdAndUpdate(user._id, { noOfAssignCase }, { new: true });
    return res.status(200).json({
      message: "Arbitrator Appointed and Notification sent successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { appointArbitratorandNotify, appointArbitratorandNotifyBulk };
