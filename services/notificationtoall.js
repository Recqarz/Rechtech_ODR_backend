require("dotenv").config();
const nodemailer = require("nodemailer");

const notificationtToall = async (cases) => {
  let respondentEmail = cases?.respondentEmail;
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
        name: "Rechtech",
        address: process.env.GMAIL_APP_ID,
      },
      to: respondentEmail,
      subject: `Arbitrator Assign for Case ${cases?.caseId}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 30px; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <header style="background: #337ab7; color: #fff; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">Arbitrator Assigned</h2>
        </header>
        <div style="padding: 20px;">
        <p style="font-size: 16px; color: #555;">Dear ${cases.respondentEmail},</p>
        <p style="font-size: 16px; color: #555;">
        We are pleased to inform you that an arbitrator has been assigned to your case. Below are the details:
        </p>
        <ul style="list-style: none; padding: 20px; margin: 0; background: #f9f9f9; border: 1px solid #e4e4e4; border-radius: 8px;">
        <li style="margin-bottom: 10px; font-size: 16px;">
          <strong>Arbitrator Name:</strong> ${cases?.arbitratorName}
        </li>
        <li style="margin-bottom: 10px; font-size: 16px;">
          <strong>Arbitrator Email:</strong> ${cases?.arbitratorEmail}
        </li>
        <li style="margin-bottom: 10px; font-size: 16px;">
          <strong>Case Id:</strong> ${cases?.caseId}
        </li>
        </ul>
        <p style="font-size: 16px; color: #555; margin-top: 20px;">
        If you have any questions or need further assistance, please don't hesitate to contact us.
        </p>
        <p style="font-size: 16px; color: #555; margin-top: 20px;">
        Best regards,<br>Team RecQARZ
        </p>
        </div>
        <footer style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 14px; color: #888;">
        <p style="margin: 0;">&copy; 2024 RecQARZ. All Rights Reserved.</p>
        </footer>
        </div>
    </div>
      `,
    };
    await transporter.sendMail(mailOptions);

    const clientmailOptions = {
      from: {
        name: "Rechtech",
        address: process.env.GMAIL_APP_ID,
      },
      to: clientEmail,
      subject: `Arbitrator Assign for Case ${cases?.caseId}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 30px; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <header style="background: #337ab7; color: #fff; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">Arbitrator Assigned</h2>
        </header>
        <div style="padding: 20px;">
        <p style="font-size: 16px; color: #555;">Dear ${cases.clientEmail},</p>
        <p style="font-size: 16px; color: #555;">
        We are pleased to inform you that an arbitrator has been assigned to your case. Below are the details:
        </p>
        <ul style="list-style: none; padding: 20px; margin: 0; background: #f9f9f9; border: 1px solid #e4e4e4; border-radius: 8px;">
        <li style="margin-bottom: 10px; font-size: 16px;">
          <strong>Arbitrator Name:</strong> ${cases?.arbitratorName}
        </li>
        <li style="margin-bottom: 10px; font-size: 16px;">
          <strong>Arbitrator Email:</strong> ${cases?.arbitratorEmail}
        </li>
        <li style="margin-bottom: 10px; font-size: 16px;">
          <strong>Case Id:</strong> ${cases?.caseId}
        </li>
        </ul>
        <p style="font-size: 16px; color: #555; margin-top: 20px;">
        If you have any questions or need further assistance, please don't hesitate to contact us.
        </p>
        <p style="font-size: 16px; color: #555; margin-top: 20px;">
        Best regards,<br>Team RecQARZ
        </p>
        </div>
        <footer style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 14px; color: #888;">
        <p style="margin: 0;">&copy; 2024 RecQARZ. All Rights Reserved.</p>
        </footer>
        </div>
    </div>
      `,
    };
    await transporter.sendMail(clientmailOptions);

    const arbitratormailOptions = {
      from: {
        name: "Rechtech",
        address: process.env.GMAIL_APP_ID,
      },
      to: arbitratorEmail,
      subject: `Arbitrator Assign for Case ${cases?.caseId}`,
      html: `
      <div style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 30px; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <header style="background: #5cb85c; color: #fff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 24px;">Arbitrator Assigned</h2>
          </header>
          <div style="padding: 20px;">
            <p style="font-size: 16px; color: #555;">Dear ${cases?.arbitratorName},</p>
            <p style="font-size: 16px; color: #555;">
              You have been assigned as the arbitrator for a new case. Below are the case details:
            </p>
            <ul style="list-style: none; padding: 20px; margin: 0; background: #f9f9f9; border: 1px solid #e4e4e4; border-radius: 8px;">
              <li style="margin-bottom: 10px; font-size: 16px;">
                <strong>Client Name:</strong> ${cases?.clientName}
              </li>
              <li style="margin-bottom: 10px; font-size: 16px;">
                <strong>Client Email:</strong> ${cases?.clientEmail}
              </li>
              <li style="margin-bottom: 10px; font-size: 16px;">
                <strong>Case Id:</strong> ${cases?.caseId}
              </li>
            </ul>
            <p style="font-size: 16px; color: #555; margin-top: 20px;">
              Please review the case details and proceed with the necessary actions.
            </p>
            <p style="font-size: 16px; color: #555; margin-top: 20px;">
              Best regards,<br>Team RecQARZ
            </p>
          </div>
          <footer style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 14px; color: #888;">
            <p style="margin: 0;">&copy; 2024 RecQARZ. All Rights Reserved.</p>
          </footer>
        </div>
      </div>

      `,
    };
    await transporter.sendMail(arbitratormailOptions);

    return "Emails sent successfully";
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports = { notificationtToall };
