const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { USER } = require("../model/user.model");

const handleAuthSignup = async (req, res) => {
  let {password} = req.body;
  if (!password) {
    password = `Abc@111${Math.floor(Math.random().toString())}`;
    // password = "password@123";
  }
  console.log(password);
  const {
    name,
    contactNo,
    emailId,
    role,
    areaOfExperties,
    experienceInYears,
    about,
    uid
  } = req.body;
  console.log(areaOfExperties);
  try {
    const hash = await argon2.hash(password);
    if (!hash) {
      return res.status(500).json({ message: "Internel error" });
    }
    const newUser = await USER.create({
      name,
      contactNo,
      emailId,
      password: hash,
      role,
      areaOfExperties,
      experienceInYears,
      about,
      uid
    });
    if (!newUser) {
      return res.status(500).json({ message: "Internel error" });
    }
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Internel error" });
  }
};

const handleAuthLogin = async (req, res) => {
  const { emailId, password } = req.body;
  // console.log(emailId,password)
  try {
    const user = await USER.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!(await argon2.verify(user.password, password))) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    // console.log(user)
    if (!user.status) {
      return res.status(401).json({ message: "User is inactive" });
    }
    const key = process.env.JWT_SECRET_KEY;
    const authToken = jwt.sign({ id: user._id }, key);
    return res.json({ token: `bearer ${authToken}`, role: user.role });
  } catch (err) {
    return res.status(500).json({ message: "Internel error" });
  }
};

module.exports = { handleAuthSignup, handleAuthLogin };
