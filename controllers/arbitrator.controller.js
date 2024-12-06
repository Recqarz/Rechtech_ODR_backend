const { CASES } = require("../module/cases/case.model");
const { USER } = require("../module/users/user.model");

const allArbitrators = async (req, res) => {
  try {
    let arbitrator = await USER.find({ role: "arbitrator" }).sort({ _id: -1 });
    return res.status(200).json({ user: arbitrator });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateArbitrators = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    let user = await USER.findByIdAndUpdate(id, { status }, { new: true });
    return res.status(200).json({ user: user });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getArbitratorStatus = async (req, res) => {
  try {
    const users = await USER.find({ role: "arbitrator" });
    const cases = await CASES.find();
    let arbitrationCompleted = 0;
    let inUse = 0;
    let free = 0;
    for (const user of users) {
      const assignedCases = cases.filter(
        (caseItem) => caseItem.arbitratorId.toString() === user._id.toString()
      );
      if (assignedCases.length === 0) {
        free++;
      } else {
        assignedCases.forEach((caseItem) => {
          if (caseItem.isCaseResolved) {
            arbitrationCompleted++;
          } else {
            inUse++;
          }
        });
      }
    }
    const totalArbitrators = users.length;
    const innerCircle = (arbitrationCompleted / totalArbitrators) * 100;
    const middleCircle = (inUse / totalArbitrators) * 100;
    const outerCircle = (free / totalArbitrators) * 100;
    let obj = {
      innerCircle: innerCircle.toFixed(2),
      middleCircle: middleCircle.toFixed(2),
      outerCircle: outerCircle.toFixed(2),
    };
    return res.status(200).json(obj);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { allArbitrators, updateArbitrators, getArbitratorStatus };
