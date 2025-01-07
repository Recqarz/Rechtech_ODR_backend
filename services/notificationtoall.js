require("dotenv").config();
// const sgMail = require("@sendgrid/mail");
const { default: axios } = require("axios");
const notificationToarbitratorforcaseassign = async (cases) => {
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    // const msg = {
    //   to: cases.arbitratorEmail,
    //   from: process.env.SENDGRID_SENDER_EMAIL,
    //   subject: "Appointment as Arbitrator for Case(s)",
    //   html: `
    //       <h4>Dear ${cases.arbitratorName},</h4>
    //       <p>You have been appointed as the arbitrator for the following cases on behalf of ${cases.clientName}.</p>
    //       <p><b>Client Name: </b>${cases.clientName}</p>
    //       <p><b>File Reference: </b>${cases.fileName ? cases?.fileName : "NA"}</p>
    //       <h4>Best regards,</h4>
    //       <p>Team Sandhee</p>
    //       `,
    // };
    const html = `
         <h4>Dear ${cases.arbitratorName},</h4>
         <p>You have been appointed as the arbitrator for the following cases on behalf of ${
           cases.clientName
         }.</p>
         <p><b>Client Name: </b>${cases.clientName}</p>
        <p><b>File Reference: </b>${cases.fileName ? cases?.fileName : "NA"}</p>
        <h4>Best regards,</h4>
       <p>Team Sandhee</p>
        `;
    const emailData = {
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: cases.arbitratorEmail, name: "User" }],
      subject: "Appointment as Arbitrator for Case(s)",
      htmlContent: html,
    };

    await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_SENDER_API_KEY,
        "content-type": "application/json",
      },
    });
    // Send the email
    // await sgMail.send(msg);
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

const notificationTorespondentforcaseassign = async (cases) => {
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    // const msg = {
    //   to: cases.respondentEmail,
    //   from: process.env.SENDGRID_SENDER_EMAIL,
    //   subject: "Notification of Arbitrator Appointment for Your Case",
    //   html: `
    //       <h4>Dear ${cases.respondentName},</h4>
    //       <p>We are notifying you that an arbitrator has been appointed for your case on behalf of ${cases.clientName}</p>
    //       <h4>Below are the details:</h4>
    //       <p><b>Arbitrator Name: </b>${cases.arbitratorName}</p>
    //       <p><b>Contact Information: </b>${cases.arbitratorEmail}</p>
    //       <p><b>Client Name: </b>${cases.clientName}</p>
    //       <h4>Best regards,</h4>
    //       <p>Team Sandhee</p>
    //       `,
    // };

    const html = `
          <h4>Dear ${cases.respondentName},</h4>
          <p>We are notifying you that an arbitrator has been appointed for your case on behalf of ${cases.clientName}</p>
          <h4>Below are the details:</h4>
          <p><b>Arbitrator Name: </b>${cases.arbitratorName}</p>
          <p><b>Contact Information: </b>${cases.arbitratorEmail}</p>
          <p><b>Client Name: </b>${cases.clientName}</p>
          <h4>Best regards,</h4>
          <p>Team Sandhee</p>
          `;
    const emailData = {
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: cases.respondentEmail, name: "User" }],
      subject: "Notification of Arbitrator Appointment for Your Case",
      htmlContent: html,
    };

    await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_SENDER_API_KEY,
        "content-type": "application/json",
      },
    });
    // await sgMail.send(msg);
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

const notificationToclientforcaseassign = async (cases) => {
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    // const msg = {
    //   to: cases.clientEmail,
    //   from: process.env.SENDGRID_SENDER_EMAIL,
    //   subject: "Notification of Arbitrator Appointment for Your Case",
    //   html: `
    //       <h4>Dear ${cases.respondentName},</h4>
    //       <p>We are notifying you that an arbitrator has been appointed for your case.</p>
    //       <h4>Below are the details:</h4>
    //       <p><b>Arbitrator Name: </b>${cases.arbitratorName}</p>
    //       <p><b>Contact Information: </b>${cases.arbitratorEmail}</p>
    //       <p><b>Client Name: </b>${cases.clientName}</p>
    //       <h4>Best regards,</h4>
    //       <p>Team Sandhee</p>
    //       `,
    // };

    const html = `
    <h4>Dear ${cases.clientName},</h4>
    <p>We are notifying you that an arbitrator has been appointed for your case.</p>
    <h4>Below are the details:</h4>
    <p><b>Arbitrator Name: </b>${cases.arbitratorName}</p>
    <p><b>Contact Information: </b>${cases.arbitratorEmail}</p>
    <p><b>Client Name: </b>${cases.clientName}</p>
    <h4>Best regards,</h4>
    <p>Team Sandhee</p>
    `;

    const emailData = {
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: cases.clientEmail, name: "User" }],
      subject: "Notification of Arbitrator Appointment for Your Case",
      htmlContent: html,
    };

    await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_SENDER_API_KEY,
        "content-type": "application/json",
      },
    });

    // await sgMail.send(msg);
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
  notificationToarbitratorforcaseassign,
  notificationTorespondentforcaseassign,
  notificationToclientforcaseassign,
};
