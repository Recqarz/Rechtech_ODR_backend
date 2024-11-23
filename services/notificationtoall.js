require("dotenv").config();
const nodemailer = require("nodemailer");

const notificationtToall = async (cases) => {
  let defaulterEmails = cases?.defaulters?.map(
    (defaulter) => defaulter.emailId
  );
  let clientEmail = cases?.clientEmail;
  let arbitratorEmail = cases?.arbitratorEmail;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: process.env.GMAIL_APP_ID,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: "Rechtech Notifications",
        address: process.env.GMAIL_APP_ID,
      },
      to: defaulterEmails,
      subject: `Rechtech - Case Notification for Defaulters`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 30px; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <header style="background: #d9534f; color: #fff; padding: 20px; text-align: center;">
              <h2 style="margin: 0; font-size: 24px;">
                Urgent Action Required
              </h2>
            </header>
            <div style="padding: 20px;">
              <p style="font-size: 16px; color: #555;">Dear Defaulters,</p>
              <p style="font-size: 16px; color: #555;">
                We have received a new case that includes the following details:
              </p>
              <ul style="list-style: none; padding: 20px; margin: 0; background: #f9f9f9; border: 1px solid #e4e4e4; border-radius: 8px;">
                <li style="margin-bottom: 10px; font-size: 16px;">
                  <strong>Client Email:</strong> ${clientEmail}
                </li>
                <li style="font-size: 16px;">
                  <strong>Arbitrator Email:</strong> ${arbitratorEmail}
                </li>
              </ul>
              <p style="font-size: 16px; color: #555; margin-top: 20px;">
                Please take necessary action promptly.
              </p>
            </div>
            <footer style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 14px; color: #888;">
              <p style="margin: 0;">
                &copy; 2024 RechTech. All Rights Reserved.
              </p>
            </footer>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);

    const clientmailOptions = {
      from: {
        name: "Rechtech Notifications",
        address: process.env.GMAIL_APP_ID,
      },
      to: [clientEmail],
      subject: `Rechtech - Your Case Assignment Details`,
      html: `<div style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 30px; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <header style="background: #0275d8; color: #fff; padding: 20px; text-align: center;">
              <h2 style="margin: 0; font-size: 24px;">
                Case Assignment Details
              </h2>
            </header>
            <div style="padding: 20px;">
              <p style="font-size: 16px; color: #555;">Dear Client,</p>
              <p style="font-size: 16px; color: #555;">
                Your case has been assigned with the following details:
              </p>
              <ul style="list-style: none; padding: 20px; margin: 0; background: #f9f9f9; border: 1px solid #e4e4e4; border-radius: 8px;">
                <li style="margin-bottom: 10px; font-size: 16px;">
                  <strong>Arbitrator Name:</strong> ${cases?.arbitrator}
                </li>
                <li style="font-size: 16px;">
                  <strong>Arbitrator Email:</strong> ${arbitratorEmail}
                </li>
              </ul>
              <p style="font-size: 16px; color: #555; margin-top: 20px;">
                We are here to assist you in resolving your case effectively.
              </p>
            </div>
            <footer style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 14px; color: #888;">
              <p style="margin: 0;">
                &copy; 2024 RechTech. All Rights Reserved.
              </p>
            </footer>
          </div>
        </div>`,
    };
    await transporter.sendMail(clientmailOptions);

    const arbitratormailOptions = {
      from: {
        name: "Rechtech Notifications",
        address: process.env.GMAIL_APP_ID,
      },
      to: [arbitratorEmail],
      subject: `Rechtech - New Case Assigned to You`,
      html: `<div style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 30px; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <header style="background: #5cb85c; color: #fff; padding: 20px; text-align: center;">
              <h2 style="margin: 0; font-size: 24px;">New Case Assignment</h2>
            </header>
            <div style="padding: 20px;">
              <p style="font-size: 16px; color: #555;">Dear Arbitrator,</p>
              <p style="font-size: 16px; color: #555;">
                You have been assigned a new case with the following details:
              </p>
              <ul style="list-style: none; padding: 20px; margin: 0; background: #f9f9f9; border: 1px solid #e4e4e4; border-radius: 8px;">
                <li style="margin-bottom: 10px; font-size: 16px;">
                  <strong>Client Name:</strong> ${cases?.clientName}
                </li>
                <li style="margin-bottom: 10px; font-size: 16px;">
                  <strong>Client Email:</strong> ${clientEmail}
                </li>
                <li style="font-size: 16px;">
                  <strong>File Name:</strong> ${cases?.fileName}
                </li>
              </ul>
              <p style="font-size: 16px; color: #555; margin-top: 20px;">
                Please review the case details and proceed accordingly.
              </p>
            </div>
            <footer style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 14px; color: #888;">
              <p style="margin: 0;">
                &copy; 2024 RechTech. All Rights Reserved.
              </p>
            </footer>
          </div>
        </div>`,
    };
    await transporter.sendMail(arbitratormailOptions);

    return "Emails sent successfully";
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports = { notificationtToall };
