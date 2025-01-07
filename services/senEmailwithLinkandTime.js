require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const { default: axios } = require("axios");
const formatDateTime = (time) => {
  const date = new Date(time);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${day}/${month}/${year}, ${hours}.${formattedMinutes}${ampm}`;
};

const notificationForMeetingSchedule = async (
  cases,
  link,
  startTime,
  endTime
) => {
  let start = formatDateTime(startTime);
  let end = formatDateTime(endTime);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    const emails = [];
    if (!emails.includes(cases.respondentEmail)) {
      emails.push(cases.respondentEmail);
    }
    if (!emails.includes(cases.clientEmail)) {
      emails.push(cases.clientEmail);
    }
    if (!emails.includes(cases.arbitratorEmail)) {
      emails.push(cases.arbitratorEmail);
    }
    // const msg = {
    //   to: emails,
    //   from: process.env.SENDGRID_SENDER_EMAIL,
    //   subject: "Meeting Scheduled for Arbitration Case",
    //   html: `
    //       <h4>Hi,</h4>
    //       <p>We are inform you that a meeting has been scheduled for the arbitration case. Below are the meeting details:</p>
    //       <p><b>Case Id: </b>${cases.caseId}</p>
    //       <p><b>Date: </b>${start?.split(",")[0]}</p>
    //       <p><b>Time: </b>${start?.split(" ")[1]}-${end?.split(" ")[1]}</p>
    //       <p><b>Location/Platform: </b>Webex</p>
    //       <p><b>Meeting Link: </b><a href="${link}" target="_blank" style="color: #007bff; text-decoration: none;">${link}</a></p>
    //       <p><b>Arbitrator Name: </b>${cases.arbitratorName}</p>
    //       <h4>Best regards,</h4>
    //       <p>Team Sandhee</p>
    //       `,
    // };
    const html = `
          <h4>Hi,</h4>
          <p>We are inform you that a meeting has been scheduled for the arbitration case. Below are the meeting details:</p>
          <p><b>Case Id: </b>${cases.caseId}</p>
          <p><b>Date: </b>${start?.split(",")[0]}</p>
          <p><b>Time: </b>${start?.split(" ")[1]}-${end?.split(" ")[1]}</p>
          <p><b>Location/Platform: </b>Webex</p>
          <p><b>Meeting Link: </b><a href="${link}" target="_blank" style="color: #007bff; text-decoration: none;">${link}</a></p>
          <p><b>Arbitrator Name: </b>${cases.arbitratorName}</p>
          <h4>Best regards,</h4>
          <p>Team Sandhee</p>
          `;
    // await sgMail.send(msg);
    const emailData = {
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: emails.map((ele) => {
        return { email: ele, name: "User" };
      }),
      subject: "Meeting Scheduled for Arbitration Case",
      htmlContent: html,
    };
    await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_SENDER_API_KEY,
        "content-type": "application/json",
      },
    });
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

module.exports = { notificationForMeetingSchedule };
