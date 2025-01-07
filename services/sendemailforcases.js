require("dotenv").config();
// const sgMail = require("@sendgrid/mail");
const { USER } = require("../module/users/user.model");
const { default: axios } = require("axios");

const sendEmailsforCases = async (name, email) => {
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
    // const msg = {
    //   to: email, // List of recipients
    //   from: process.env.SENDGRID_SENDER_EMAIL, // Verified sender email
    //   subject: "Action Required: Selection of Arbitrator for Your Case",
    //   html: `
    //       <h4>Dear ${name},</h4>
    //       <p>We hope this message finds you well.</p>
    //       <p>In connection with the recent proceedings initiated on the Sandhee Platform, we request you to select an arbitrator from the list provided below within 7 days of receiving this email.
    //       Please find the options for arbitrators:</p>
    //       <ul>
    //         ${arbitratorList}
    //       </ul>
    //     `,
    // };

    const html = `
    <h4>Dear ${name},</h4>
    <p>We hope this message finds you well.</p>
    <p>In connection with the recent proceedings initiated on the Sandhee Platform, we request your prompt attention to the following:</p>
    <p><b>1. Select an Arbitrator:</b> Kindly select an arbitrator from the list provided below within 7 days of receiving this email:</p>
    <ul>${arbitratorList}</ul>
    <p><b>2. Log In to Our Platform:</b> To complete this process, please log in to your account on the Sandhee Platform as a respondent using your account number by visiting 
    <a href="https://www.odr.sandhee.com" target="_blank">www.odr.sandhee.com</a>. Once logged in, navigate to the "cases" section.</p>
    <p>In the "cases" section, you can view the current status of the proceedings, including any updates or actions required from your end.</p>
    <p>Thank you for your cooperation.</p>
    <br>
    <p>Best Regards,</p>
    <p>Sandhee Team</p>
`;

    const emailData = {
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: email, name: "User" }],
      subject: "Action Required: Selection of Arbitrator for Your Case",
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

module.exports = { sendEmailsforCases };
