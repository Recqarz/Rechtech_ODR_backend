require("dotenv").config();
const argon2 = require("argon2");
const { PASSWORDRESET } = require("../model/resetPassword.model");
const { USER } = require("../module/users/user.model");
const { sendSmsToRecipient } = require("../services/sendOtpToNumber");
const { default: axios } = require("axios");

// Reset password if user forget his password

const userExists = async (req, res) => {
  const { emailId } = req.body;

  try {
    let user = await USER.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // otp to mail
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
      to: [{ email: emailId, name: user.name || "User" }],
      subject: "Your Password Reset OTP",
      htmlContent: html,
    };

    try {
      await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_SENDER_API_KEY,
          "content-type": "application/json",
        },
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({ message: "Failed to send OTP via email." });
    }

    // OTP to SMS
    const { contactNo } = user;
    if (!contactNo) {
      return res
        .status(400)
        .json({ message: "User contact number is missing." });
    }

    const otpSMS = (Math.floor(Math.random() * 9000) + 1000).toString();
    const text = `Your OTP for Sandhee Platform is ${otpSMS}. It is valid for 5 minutes. Please do not share it with anyone. Team SANDHEE (RecQARZ)`;

    try {
      sendSmsToRecipient(contactNo, text);
      // Save OTPs in database
      await PASSWORDRESET.deleteMany({ emailId });
      await PASSWORDRESET.create({ emailId, otp, otpSMS });
      return res
        .status(200)
        .json({ message: "OTP sent successfully to Number and Email" });
    } catch (smsError) {
      console.error("Error sending SMS:", smsError);
      return res.status(500).json({ message: "Failed to send OTP via SMS." });
    }
  } catch (err) {
    console.error("Error in userExists function:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// After putting otp
const verifyOtp = async (req, res) => {
  const { emailId, otp, otpSMS } = req.body;
  try {
    const userPassword = await PASSWORDRESET.findOne({ emailId: emailId });
    if (!userPassword) {
      return res.status(404).json({ message: "User not found" });
    }
    if (userPassword.otp !== otp) {
      return res.status(401).json({ message: "Invalid Email OTP" });
    }

    if (userPassword.otpSMS !== otpSMS) {
      return res.status(401).json({ message: "Invalid Number OTP" });
    }
    await PASSWORDRESET.deleteMany({ emailId: emailId });
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//update password after putting right otp
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
