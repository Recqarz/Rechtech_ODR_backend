require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const { USER } = require("../module/users/user.model");

const sendEmailsforCases = async (bulkInsertDatas) => {
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
      to: bulkInsertDatas, // List of recipients
      from: process.env.SENDGRID_SENDER_EMAIL, // Verified sender email
      subject: "Selection of arbitrator",
      html: `
          <h1>Please select the arbitrator from below list</h1>
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
    throw new Error("Failed to send arbitrator list email");
  }
};

module.exports = { sendEmailsforCases };
