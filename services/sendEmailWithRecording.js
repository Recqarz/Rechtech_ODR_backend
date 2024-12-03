require("dotenv").config();
const sgMail = require("@sendgrid/mail");

const sendEmailtoArbitratorWithRecording = async (cases, recording) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    const msg = {
      to: cases.arbitratorEmail,
      from: process.env.SENDGRID_SENDER_EMAIL,
      subject: "Recording Available of Case Id: " + cases.caseId,
      html: `
            <h4>Dear ${cases.arbitratorName},</h4>
            <p>Recording is Available for previous case with Case Id ${cases.caseId}.</p>
            <p><b>Recording Link: </b>${recording.playbackUrl}</p>
            <p><b>Recording Password: </b>${recording.password}</p>
            <h4>Best regards,</h4>
            <p>Team Sandhee</p>
            `,
    };

    // Send the email
    await sgMail.send(msg);
    console.log("Email sent successfully.");

    return true;
  } catch (error) {
    console.error("Error fetching arbitrators or sending email:", error);
    if (error.response) {
      console.error("Error response body:", error.response.body);
    }
    return false;
  }
};

const sendEmailtoClientWithRecording = async (cases, recording) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    const msg = {
      to: cases.clientEmail,
      from: process.env.SENDGRID_SENDER_EMAIL,
      subject: "Recording Available of Case Id: " + cases.caseId,
      html: `
              <h4>Dear ${cases.clientName},</h4>
              <p>Recording is Available for previous case with Case Id ${cases.caseId}.</p>
              <p><b>Recording Link: </b>${recording.playbackUrl}</p>
              <p><b>Recording Password: </b>${recording.password}</p>
              <h4>Best regards,</h4>
              <p>Team Sandhee</p>
              `,
    };

    // Send the email
    await sgMail.send(msg);
    console.log("Email sent successfully.");

    return true;
  } catch (error) {
    console.error("Error fetching arbitrators or sending email:", error);
    if (error.response) {
      console.error("Error response body:", error.response.body);
    }
    return false;
  }
};

const sendEmailtoRespondentWithRecording = async (cases, recording) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    const msg = {
      to: cases.respondentEmail,
      from: process.env.SENDGRID_SENDER_EMAIL,
      subject: "Recording Available of Case Id: " + cases.caseId,
      html: `
              <h4>Dear ${cases.respondentName},</h4>
              <p>Recording is Available for previous case with Case Id ${cases.caseId}.</p>
              <p><b>Recording Link: </b>${recording.playbackUrl}</p>
              <p><b>Recording Password: </b>${recording.password}</p>
              <h4>Best regards,</h4>
              <p>Team Sandhee</p>
              `,
    };

    // Send the email
    await sgMail.send(msg);
    console.log("Email sent successfully.");

    return true;
  } catch (error) {
    console.error("Error fetching arbitrators or sending email:", error);
    if (error.response) {
      console.error("Error response body:", error.response.body);
    }
    return false;
  }
};

module.exports = {
  sendEmailtoArbitratorWithRecording,
  sendEmailtoClientWithRecording,
  sendEmailtoRespondentWithRecording,
};
