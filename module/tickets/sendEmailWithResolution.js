require("dotenv").config();
const { default: axios } = require("axios");

const sendEmailWithResolution = async (ticket) => {
  try {
    const html = `
    <h4>Dear ${ticket.name},</h4>
    <p>We are pleased to inform you that your ticket with ID <strong>${ticket.ticketId}</strong> has been resolved.</p>
    <p><strong>Query:</strong> ${ticket.query}</p>
    <p><strong>Category:</strong> ${ticket.category}</p>
    <p><strong>Resolution:</strong> ${ticket.resolution}</p>
    <p>If you have further queries or concerns, please feel free to contact us again.</p>
    <h4>Best regards,</h4>
    <p>Team Sandhee</p>
  `;
    const emailData = {
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: ticket.email, name: "User" }],
      subject: `Resolution of Your Ticket ID: ${ticket.ticketId}`,
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
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("Error response body:", error.response.body);
    }
    return false;
  }
};

module.exports = { sendEmailWithResolution };
