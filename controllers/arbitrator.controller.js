const { USER } = require("../model/user.model");

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
module.exports = { allArbitrators, updateArbitrators };
