require("dotenv").config();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { USER } = require("./user.model");
const { RESPONDENT } = require("./respondent.model");
const { sendSmsToRecipient } = require("../../services/sendOtpToNumber");
const { default: axios } = require("axios");

//Signup for arbitrator, Admin and respondent

const handleAuthSignup = async (req, res) => {
  let {
    name,
    password,
    contactNo,
    emailId,
    role,
    areaOfExperties,
    experienceInYears,
    about,
    uid,
    address,
  } = req.body;

  if (password) {
    try {
      let user = await USER.findOne({ emailId });
      if (user) {
        return res.status(404).json({ message: "User already exists" });
      }

      const hash = await argon2.hash(password);
      if (!hash) {
        return res.status(500).json({ message: "Internal error" });
      }

      // OTP via SMS
      const otpSMS = (Math.floor(Math.random() * 9000) + 1000).toString();
      const text = `Your OTP for Sandhee Platform is ${otpSMS}. It is valid for 5 minutes. Please do not share it with anyone. Team SANDHEE (RecQARZ)`;
      await sendSmsToRecipient(contactNo, text);

      // OTP via Email
      const otpMail = (Math.floor(Math.random() * 9000) + 1000).toString();
      const html = `
       <h4>Hi ${name},</h4>
       <p>Your OTP for registration at Sandhee Platform is: <b>${otpMail}</b></p>
       <p>Please enter this code to proceed with registration.</p>
       <h4>Best regards,</h4>
       <p>Team Sandhee</p>
     `;

      const emailData = {
        sender: {
          name: process.env.BREVO_SENDER_NAME,
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email: emailId, name: "User" }],
        subject: "Your OTP For Registration",
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
      } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send OTP via email." });
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
        otpSMS,
        otpMail,
      });

      if (!newUser) {
        return res.status(500).json({ message: "Internal error" });
      }

      return res
        .status(201)
        .json({ message: "OTP sent successfully to number and email!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal error2" });
    }
  } else {
    password = `Abc@111${Math.floor(Math.random() * 1000)}`;
    try {
      const hash = await argon2.hash(password);
      if (!hash) {
        return res.status(500).json({ message: "Internal error" });
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
        uid
      });
      if (!newUser) {
        return res.status(500).json({ message: "Internal error" });
      }
      return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal error" });
    }
  }
};


/*
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
    let user = await USER.findOne({ emailId });
    if (user) {
      return res.status(404).json({ message: "User already exists" });
    }

    const hash = await argon2.hash(password);
    if (!hash) {
      return res.status(500).json({ message: "Internel error" });
    }

  // otp via SMS
    const otpSMS = (Math.floor(Math.random() * 9000) + 1000).toString();
    const text = `Your OTP for Sandhee Platform is ${otpSMS}. It is valid for 5 minutes. Please do not share it with anyone. Team SANDHEE (RecQARZ)`;
    sendSmsToRecipient(contactNo, text);

   
   //OTP to Mail
   const otpMail = (Math.floor(Math.random() * 9000) + 1000).toString();
   const html = `
     <h4>Hi ${name},</h4>
     <p>Your OTP for registration at andhee Platform is: <b>${otpMail}</b></p>
     <p>Please enter this code to proceed with registration.</p>
     <h4>Best regards,</h4>
     <p>Team Sandhee</p>
   `;

   const emailData = {
     sender: {
       name: process.env.BREVO_SENDER_NAME,
       email: process.env.BREVO_SENDER_EMAIL,
     },
     to: [{ email: emailId, name: "User" }],
     subject: "Your OTP For Registraton",
     htmlContent: html,
   };

   await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
     headers: {
       accept: "application/json",
       "api-key": process.env.BREVO_SENDER_API_KEY,
       "content-type": "application/json",
     },
   });

    await USER.deleteMany({ emailId });
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
      otpSMS,
      otpMail
    });
    if (!newUser) {
      return res.status(500).json({ message: "Internel error" });
    }
    return res
      .status(201)
      .json({ message: "OTP sent successfully to number and email!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internel error2" });
  }
};
*/

// Signup to put OTP page(api: http://localhost:4001/api/auth/register/otp)
const handleAuthSignUpOTP = async (req, res) => {
  const { emailId, otpSMS, otpMail } = req.body;
  try {
    let user = await USER.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: "Email not found!" });
    }
    const verifyOTP = await USER.findOne({
      emailId: emailId,
      otpSMS: otpSMS,
      otpMail: otpMail,
    });
    if (!verifyOTP) {
      return res.status(404).json({ message: "Otp not found" });
    }
    if (Date.now() - verifyOTP.date > 1000 * 60 * 10) {
      return res.status(401).json({ message: "Otp expired" });
    }
    const { role } = verifyOTP;

    const key = process.env.JWT_SECRET_KEY;
    const authToken = jwt.sign({ emailId: verifyOTP.emailId }, key, {
      expiresIn: "1d",
    });
    return res.status(200).json({ token: `bearer ${authToken}`, role: role });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internel error" });
  }
};

//login
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
    const authToken = jwt.sign({ id: user._id }, key, { expiresIn: "1d" });
    return res.json({ token: `bearer ${authToken}`, role: user.role });
  } catch (err) {
    return res.status(500).json({ message: "Internel error" });
  }
};

//respondent for login(put account no)
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

//verify otp for respondent
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
    const authToken = jwt.sign({ accountNumber: login.accountNumber }, key, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .json({ token: `bearer ${authToken}`, role: "respondent" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internel error" });
  }
};

//validate token
const validateToken = (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  const tokens = token.split(" ")[1];
  if (!tokens) {
    return res.status(401).json({ message: "Token not provided" });
  }
  try {
    const key = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(tokens, key);
    if (!decoded) {
      return res.status(403).json({ message: "Token is not valid" });
    }
    return res.json({ message: "Token is valid" });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Token is not valid" });
  }
};

module.exports = {
  handleAuthSignup,
  handleAuthLogin,
  respondentOTP,
  respondentLogin,
  validateToken,
  handleAuthSignUpOTP,
};
