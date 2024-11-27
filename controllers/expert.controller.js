const { EXPERTIES } = require("../model/areaOfExperties.model");

const addExperties = async (req, res) => {
  const { name } = req.body;

  try {
    const expertise = new EXPERTIES({
      name,
    });
    await expertise.save();
    res.status(201).json({ message: "Expertise added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const allExperties = async (req, res) => {
  try {
    const experties = await EXPERTIES.find();
    res.status(200).json({ experties });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addExperties, allExperties };
