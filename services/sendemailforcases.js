require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const { USER } = require("../module/users/user.model");

const sendEmailsforCases = async (name, email) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    // Fetch the list of arbitrators
    const arbitrators = await USER.find({ role: "arbitrator" });
    if (!arbitrators || arbitrators.length === 0) {
      console.log("No arbitrators found.");
      return;
    }

    // Format the arbitrator list into an HTML string
    const arbitratorList = arbitrators
      .map((arbitrator, index) => `<li>${index + 1}. ${arbitrator.name}</li>`)
      .join("");

    // Create the email message
    const msg = {
      to: email, // List of recipients
      from: process.env.SENDGRID_SENDER_EMAIL, // Verified sender email
      subject: "Action Required: Selection of Arbitrator for Your Case",
      html: `
          <h4>Dear ${name},</h4>
          <p>We hope this message finds you well.</p>
          <p>In connection with the recent proceedings initiated on the Sandhee Platform, we request you to select an arbitrator from the list provided below within 7 days of receiving this email.
          Please find the options for arbitrators:</p>
          <ul>
            ${arbitratorList}
          </ul>
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

module.exports = { sendEmailsforCases };
