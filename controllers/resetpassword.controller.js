require("dotenv").config();
const argon2 = require("argon2");
const { PASSWORDRESET } = require("../model/resetPassword.model");
const { USER } = require("../module/users/user.model");
const { default: axios } = require("axios");

const userExists = async (req, res) => {
  const { emailId } = req.body;
  try {
    let user = await USER.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = (Math.floor(Math.random() * 9000) + 1000).toString();
    const html = `
      <h4>Hi ${user.name},</h4>
      <p>Your OTP to reset your password is: <b>${otp}</b></p>
      <p>Please enter this code to proceed with resetting your password.</p>
      <h4>Best regards,</h4>
      <p>Team Sandhee</p>
    `;

    const emailData = {
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: emailId, name: "User" }],
      subject: "Your Password Reset OTP",
      htmlContent: html,
    };

    await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_SENDER_API_KEY,
        "content-type": "application/json",
      },
    });

    await PASSWORDRESET.deleteMany({ emailId });
    await PASSWORDRESET.create({ emailId, otp });

    return res.status(200).json({ message: "OTP email sent successfully" });
  } catch (err) {
    console.error("Error in userExists function:", err);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const verifyOtp = async (req, res) => {
  const { emailId, otp } = req.body;
  try {
    const userPassword = await PASSWORDRESET.findOne({ emailId: emailId });
    if (!userPassword) {
      return res.status(404).json({ message: "User not found" });
    }
    if (userPassword.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    await PASSWORDRESET.deleteMany({ emailId: emailId });
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updatepassword = async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const hash = await argon2.hash(password);
    const user = await USER.findOneAndUpdate(
      { emailId: emailId },
      { password: hash },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { userExists, verifyOtp, updatepassword };
