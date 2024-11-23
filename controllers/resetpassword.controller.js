require("dotenv").config();
const argon2 = require("argon2");
const { PASSWORDRESET } = require("../model/resetPassword.model");
const { USER } = require("../model/user.model");
const nodemailer = require("nodemailer");

const userExists = async (req, res) => {
  const { emailId } = req.body;
  try {
    let user = await USER.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: process.env.GMAIL_APP_ID,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const otpn = Math.floor(Math.random() * 9000) + 1000;
    const otp = otpn.toString();

    const mailOptions = {
      from: {
        name: "Rechtech",
        address: process.env.GMAIL_APP_ID,
      },
      to: [emailId],
      subject: "Your Password Reset OTP",
      html: `
      <div style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 30px; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <header style="background: #0275d8; color: #fff; padding: 20px; text-align: center;">
      <h2 style="margin-left: 20px; font-size: 24px; margin-top:10px;">Hi ${user.name},</h2>
      </header>
      <div style="padding: 20px;">
      <p style="font-size: 16px; color: #555;">Your OTP to reset your password is: ${otp}</p>
      <p style="font-size: 16px; color: #555;">Please enter this code to proceed with resetting your password.</p>
      <footer style=" margin: 0; font-size: 16px; text-align: center; padding : 10px;">
      <h2 style="margin: 0; font-size: 16px; color: #555; font-weight: bold; font-style: italic }">
      Best regards,
      </h2>
      <p style="margin: 0; font-size: 14px; color: #999;">
       Team RecQarz
      </p>
      </footer>
      `,
    };

    await transporter.sendMail(mailOptions);
    await PASSWORDRESET.deleteMany({ emailId: emailId });
    const userPassword = await PASSWORDRESET.create({
      emailId: emailId,
      otp: otp,
    });
    if (!userPassword) {
      return res.status(500).json({ message: "Internal error" });
    }
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
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
