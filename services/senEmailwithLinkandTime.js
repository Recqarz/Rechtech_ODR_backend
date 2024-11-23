require("dotenv").config();
const nodemailer = require("nodemailer");
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
const senEmailwithLinkandTime = async (cases, link, startTime, endTime) => {
  let start = formatDateTime(startTime);
  let end = formatDateTime(endTime);
  try {
    let defaulterEmails = cases?.defaulters?.map(
      (defaulter) => defaulter.emailId
    );
    let clientEmail = cases?.clientEmail;
    let arbitratorEmail = cases?.arbitratorEmail;
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
      subject: `Rechtech - Case Notification`,
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
                  We have Schedule the meeting kindly join the meeting:
                </p>
                <h2>Meeting Link : ${link}</h2>
                <h4>Starting from ${start} and end at ${end}</h4>
                <ul style="list-style: none; padding: 20px; margin: 0; background: #f9f9f9; border: 1px solid #e4e4e4; border-radius: 8px;">
                  <li style="margin-bottom: 10px; font-size: 16px;">
                    <strong>Client Email:</strong> ${clientEmail}
                  </li>
                  <li style="font-size: 16px;">
                    <strong>Arbitrator Name:</strong> ${cases.arbitrator}
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
      to: clientEmail,
      subject: `Rechtech - Case Notification`,
      html: `
            <div style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 30px; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <header style="background: #d9534f; color: #fff; padding: 20px; text-align: center;">
                  <h2 style="margin: 0; font-size: 24px;">
                    Urgent Action Required
                  </h2>
                </header>
                <div style="padding: 20px;">
                  <p style="font-size: 16px; color: #555;">Dear Client,</p>
                  <p style="font-size: 16px; color: #555;">
                    We have Schedule the meeting kindly join the meeting:
                  </p>
                  <h2>Meeting Link : ${link}</h2>
                  <h4>Starting from ${start} and end at ${end}</h4>
                  <ul style="list-style: none; padding: 20px; margin: 0; background: #f9f9f9; border: 1px solid #e4e4e4; border-radius: 8px;">
                    
                    <li style="font-size: 16px;">
                      <strong>Arbitrator Name:</strong> ${cases.arbitrator}
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
    await transporter.sendMail(clientmailOptions);

    const arbitratormailOptions = {
      from: {
        name: "Rechtech Notifications",
        address: process.env.GMAIL_APP_ID,
      },
      to: arbitratorEmail,
      subject: `Rechtech - Case Notification`,
      html: `
            <div style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 30px; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <header style="background: #d9534f; color: #fff; padding: 20px; text-align: center;">
                  <h2 style="margin: 0; font-size: 24px;">
                    Urgent Action Required
                  </h2>
                </header>
                <div style="padding: 20px;">
                  <p style="font-size: 16px; color: #555;">Dear Arbitrator,</p>
                  <p style="font-size: 16px; color: #555;">
                    Meeting is Schedule Successfully:
                  </p>
                  <h2>Meeting Link : ${link}</h2>
                  <h4>Starting from ${start} and end at ${end}</h4>
                  <ul style="list-style: none; padding: 20px; margin: 0; background: #f9f9f9; border: 1px solid #e4e4e4; border-radius: 8px;">
                    
                    <li style="font-size: 16px;">
                      <strong>Arbitrator Name:</strong> ${cases.arbitrator}
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
    await transporter.sendMail(arbitratormailOptions);
    return "Email sent successfully";
  } catch (err) {
    console.error(err);
    throw new Error("Failed to send email");
  }
};

module.exports = { senEmailwithLinkandTime };
