require("dotenv").config();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { USER } = require("./user.model");
const { RESPONDENT } = require("./respondent.model");
const {
  sendSmsToRecipient,
} = require("../../services/sendOtpToNumber");

const handleAuthSignup = async (req, res) => {
  let { password } = req.body;
  if (!password) {
    password = `Abc@111${Math.floor(Math.random().toString())}`;
  }
  const {
    name,
    contactNo,
    emailId,
    role,
    areaOfExperties,
    experienceInYears,
    about,
    uid,
    address,
  } = req.body;
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
      address,
      areaOfExperties,
      experienceInYears,
      about,
      uid,
    });
    if (!newUser) {
      return res.status(500).json({ message: "Internel error" });
    }
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internel error" });
  }
};

const handleAuthLogin = async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await USER.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!(await argon2.verify(user.password, password))) {
      return res.status(401).json({ message: "Incorrect password" });
    }
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

const respondentOTP = async (req, res) => {
  const { accountNumber, respondentMobile } = req.body;
  try {
    const otp = (Math.floor(Math.random() * 9000) + 1000).toString();
    const deleteMany = await RESPONDENT.deleteMany({
      accountNumber: accountNumber,
    });
    const text = `Your OTP for Sandhee Platform is ${otp}. It is valid for 5 minutes. Please do not share it with anyone. Team SANDHEE (RecQARZ)`;
    sendSmsToRecipient(respondentMobile, text);
    const nlogin = await RESPONDENT.create({
      accountNumber,
      respondentMobile,
      otp,
      date: Date.now(),
    });
    if (!nlogin) {
      return res.status(500).json({ message: "Internel error" });
    }
    return res.status(201).json({ message: "Login otp sent successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internel error" });
  }
};

const respondentLogin = async (req, res) => {
  const { accountNumber, otp } = req.body;
  try {
    const login = await RESPONDENT.findOne({
      accountNumber: accountNumber,
      otp: otp,
    });
    if (!login) {
      return res.status(404).json({ message: "Login otp not found" });
    }
    if (Date.now() - login.date > 1000 * 60 * 10) {
      return res.status(401).json({ message: "Login otp expired" });
    }
    const key = process.env.JWT_SECRET_KEY;
    const authToken = jwt.sign({ accountNumber: login.accountNumber }, key);
    return res
      .status(200)
      .json({ token: `bearer ${authToken}`, role: "respondent" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internel error" });
  }
};

module.exports = {
  handleAuthSignup,
  handleAuthLogin,
  respondentOTP,
  respondentLogin,
};
