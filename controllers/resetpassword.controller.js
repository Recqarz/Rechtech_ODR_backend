require("dotenv").config();
const argon2 = require("argon2");
const { PASSWORDRESET } = require("../model/resetPassword.model");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const { USER } = require("../module/users/user.model");

const userExists = async (req, res) => {
  const { emailId } = req.body;

  try {
    // Check if user exists in the database
    let user = await USER.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a random 4-digit OTP
    const otp = (Math.floor(Math.random() * 9000) + 1000).toString();

    // Prepare the email message
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: [emailId],
      from: process.env.SENDGRID_SENDER_EMAIL, // Verified sender email
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 30px; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <header style="background: #0275d8; color: #fff; padding: 20px; text-align: center;">
              <h2 style="margin-left: 20px; font-size: 24px; margin-top:10px;">Hi ${user.name},</h2>
            </header>
            <div style="padding: 20px;">
              <p style="font-size: 16px; color: #555;">Your OTP to reset your password is: <strong>${otp}</strong></p>
              <p style="font-size: 16px; color: #555;">Please enter this code to proceed with resetting your password.</p>
            </div>
            <footer style="margin: 0; font-size: 16px; text-align: center; padding: 10px;">
              <h2 style="margin: 0; font-size: 16px; color: #555; font-weight: bold; font-style: italic;">Best regards,</h2>
              <p style="margin: 0; font-size: 14px; color: #999;">Team RecQarz</p>
            </footer>
          </div>
        </div>
      `,
    };

    // Send the OTP email
    try {
      await sgMail.send(msg);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      if (emailError.response) {
        console.error("Error response body:", emailError.response.body);
      }
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    // Remove old OTP entries and save the new one
    await PASSWORDRESET.deleteMany({ emailId: emailId });
    const userPassword = await PASSWORDRESET.create({ emailId: emailId, otp });

    if (!userPassword) {
      return res
        .status(500)
        .json({ message: "Internal error while saving OTP" });
    }

    return res.status(200).json({ message: "OTP email sent successfully" });
  } catch (err) {
    console.error("Error in userExists function:", err);
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
