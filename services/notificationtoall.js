require("dotenv").config();
const sgMail = require("@sendgrid/mail");
// const nodemailer = require("nodemailer");

// const notificationToall = async (cases) => {
//   let respondentEmail = cases?.respondentEmail;
//   let clientEmail = cases?.clientEmail;
//   let arbitratorEmail = cases?.arbitratorEmail;
//   console.log(respondentEmail, clientEmail, arbitratorEmail);

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       secure: false,
//       auth: {
//         user: process.env.GMAIL_APP_ID,
//         pass: process.env.GMAIL_APP_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: {
//         name: "Rechtech",
//         address: process.env.GMAIL_APP_ID,
//       },
//       to: respondentEmail,
//       subject: `Arbitrator Assign for Case ${cases?.caseId}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 30px; line-height: 1.6; color: #333;">
//         <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
//         <header style="background: #337ab7; color: #fff; padding: 20px; text-align: center;">
//         <h2 style="margin: 0; font-size: 24px;">Arbitrator Assigned</h2>
//         </header>
//         <div style="padding: 20px;">
//         <p style="font-size: 16px; color: #555;">Dear ${cases.respondentEmail},</p>
//         <p style="font-size: 16px; color: #555;">
//         We are pleased to inform you that an arbitrator has been assigned to your case. Below are the details:
//         </p>
//         <ul style="list-style: none; padding: 20px; margin: 0; background: #f9f9f9; border: 1px solid #e4e4e4; border-radius: 8px;">
//         <li style="margin-bottom: 10px; font-size: 16px;">
//           <strong>Arbitrator Name:</strong> ${cases?.arbitratorName}
//         </li>
//         <li style="margin-bottom: 10px; font-size: 16px;">
//           <strong>Arbitrator Email:</strong> ${cases?.arbitratorEmail}
//         </li>
//         <li style="margin-bottom: 10px; font-size: 16px;">
//           <strong>Case Id:</strong> ${cases?.caseId}
//         </li>
//         </ul>
//         <p style="font-size: 16px; color: #555; margin-top: 20px;">
//         If you have any questions or need further assistance, please don't hesitate to contact us.
//         </p>
//         <p style="font-size: 16px; color: #555; margin-top: 20px;">
//         Best regards,<br>Team RecQARZ
//         </p>
//         </div>
//         <footer style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 14px; color: #888;">
//         <p style="margin: 0;">&copy; 2024 RecQARZ. All Rights Reserved.</p>
//         </footer>
//         </div>
//     </div>
//       `,
//     };
//     transporter.sendMail(mailOptions);

//     const clientmailOptions = {
//       from: {
//         name: "Rechtech",
//         address: process.env.GMAIL_APP_ID,
//       },
//       to: clientEmail,
//       subject: `Arbitrator Assign for Case ${cases?.caseId}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 30px; line-height: 1.6; color: #333;">
//         <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
//         <header style="background: #337ab7; color: #fff; padding: 20px; text-align: center;">
//         <h2 style="margin: 0; font-size: 24px;">Arbitrator Assigned</h2>
//         </header>
//         <div style="padding: 20px;">
//         <p style="font-size: 16px; color: #555;">Dear ${cases.clientEmail},</p>
//         <p style="font-size: 16px; color: #555;">
//         We are pleased to inform you that an arbitrator has been assigned to your case. Below are the details:
//         </p>
//         <ul style="list-style: none; padding: 20px; margin: 0; background: #f9f9f9; border: 1px solid #e4e4e4; border-radius: 8px;">
//         <li style="margin-bottom: 10px; font-size: 16px;">
//           <strong>Arbitrator Name:</strong> ${cases?.arbitratorName}
//         </li>
//         <li style="margin-bottom: 10px; font-size: 16px;">
//           <strong>Arbitrator Email:</strong> ${cases?.arbitratorEmail}
//         </li>
//         <li style="margin-bottom: 10px; font-size: 16px;">
//           <strong>Case Id:</strong> ${cases?.caseId}
//         </li>
//         </ul>
//         <p style="font-size: 16px; color: #555; margin-top: 20px;">
//         If you have any questions or need further assistance, please don't hesitate to contact us.
//         </p>
//         <p style="font-size: 16px; color: #555; margin-top: 20px;">
//         Best regards,<br>Team RecQARZ
//         </p>
//         </div>
//         <footer style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 14px; color: #888;">
//         <p style="margin: 0;">&copy; 2024 RecQARZ. All Rights Reserved.</p>
//         </footer>
//         </div>
//     </div>
//       `,
//     };
//     transporter.sendMail(clientmailOptions);

//     const arbitratormailOptions = {
//       from: {
//         name: "Rechtech",
//         address: process.env.GMAIL_APP_ID,
//       },
//       to: arbitratorEmail,
//       subject: `Arbitrator Assign for Case ${cases?.caseId}`,
//       html: `
//       <div style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 30px; line-height: 1.6; color: #333;">
//         <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
//           <header style="background: #5cb85c; color: #fff; padding: 20px; text-align: center;">
//             <h2 style="margin: 0; font-size: 24px;">Arbitrator Assigned</h2>
//           </header>
//           <div style="padding: 20px;">
//             <p style="font-size: 16px; color: #555;">Dear ${cases?.arbitratorName},</p>
//             <p style="font-size: 16px; color: #555;">
//               You have been assigned as the arbitrator for a new case. Below are the case details:
//             </p>
//             <ul style="list-style: none; padding: 20px; margin: 0; background: #f9f9f9; border: 1px solid #e4e4e4; border-radius: 8px;">
//               <li style="margin-bottom: 10px; font-size: 16px;">
//                 <strong>Client Name:</strong> ${cases?.clientName}
//               </li>
//               <li style="margin-bottom: 10px; font-size: 16px;">
//                 <strong>Client Email:</strong> ${cases?.clientEmail}
//               </li>
//               <li style="margin-bottom: 10px; font-size: 16px;">
//                 <strong>Case Id:</strong> ${cases?.caseId}
//               </li>
//             </ul>
//             <p style="font-size: 16px; color: #555; margin-top: 20px;">
//               Please review the case details and proceed with the necessary actions.
//             </p>
//             <p style="font-size: 16px; color: #555; margin-top: 20px;">
//               Best regards,<br>Team RecQARZ
//             </p>
//           </div>
//           <footer style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 14px; color: #888;">
//             <p style="margin: 0;">&copy; 2024 RecQARZ. All Rights Reserved.</p>
//           </footer>
//         </div>
//       </div>

//       `,
//     };
//     transporter.sendMail(arbitratormailOptions);

//     return "Emails sent successfully";
//   } catch (err) {
//     console.log(err)
//   }
// };

const notificationToarbitratorforcaseassign = async (cases) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    // Create the email message
    const msg = {
      to: cases.arbitratorEmail, // List of recipients
      from: process.env.SENDGRID_SENDER_EMAIL, // Verified sender email
      subject: "Appointment as Arbitrator for Case(s)",
      html: `
          <h4>Dear ${cases.arbitratorName},</h4>
          <p>You have been appointed as the arbitrator for the following cases on behalf of ${cases.clientName}.</p>
          <p><b>Client Name: </b>${cases.clientName}</p>
          <p><b>File Reference: </b>${cases.fileName ? cases?.fileName : "NA"}</p>
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

const notificationTorespondentforcaseassign = async (cases) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    // Create the email message
    const msg = {
      to: cases.respondentEmail, // List of recipients
      from: process.env.SENDGRID_SENDER_EMAIL, // Verified sender email
      subject: "Notification of Arbitrator Appointment for Your Case",
      html: `
          <h4>Dear ${cases.respondentName},</h4>
          <p>We are notifying you that an arbitrator has been appointed for your case on behalf of ${cases.clientName}</p>
          <h4>Below are the details:</h4>
          <p><b>Arbitrator Name: </b>${cases.arbitratorName}</p>
          <p><b>Contact Information: </b>${cases.arbitratorEmail}</p>
          <p><b>Client Name: SBI: </b>${cases.clientName}</p>
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


const notificationToclientforcaseassign = async (cases) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    // Create the email message
    const msg = {
      to: cases.clientEmail, // List of recipients
      from: process.env.SENDGRID_SENDER_EMAIL, // Verified sender email
      subject: "Notification of Arbitrator Appointment for Your Case",
      html: `
          <h4>Dear ${cases.respondentName},</h4>
          <p>We are notifying you that an arbitrator has been appointed for your case.</p>
          <h4>Below are the details:</h4>
          <p><b>Arbitrator Name: </b>${cases.arbitratorName}</p>
          <p><b>Contact Information: </b>${cases.arbitratorEmail}</p>
          <p><b>Client Name: </b>${cases.clientName}</p>
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
  notificationToarbitratorforcaseassign,
  notificationTorespondentforcaseassign,
  notificationToclientforcaseassign
};
