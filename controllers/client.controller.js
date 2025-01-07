const { USER } = require("../module/users/user.model");

// All Client
const allClient = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    let client = await USER.find({ role: "client" })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    const totalCases = await USER.countDocuments({ role: "client" });
    return res
      .status(200)
      .json({
        user: client,
        currentPage: page,
        totalPages: Math.ceil(totalCases / limit),
        totalCases,
      });
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
