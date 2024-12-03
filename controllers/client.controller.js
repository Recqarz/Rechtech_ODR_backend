const { USER } = require("../module/users/user.model");

const allClient = async (req, res) => {
  try {
    let client = await USER.find({ role: "client" }).sort({ _id: -1 });
    return res.status(200).json({ user: client });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateClient = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    let user = await USER.findByIdAndUpdate(id, { status }, { new: true });
    return res.status(200).json({ user: user });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { allClient, updateClient };
