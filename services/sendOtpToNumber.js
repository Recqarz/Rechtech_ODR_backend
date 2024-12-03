const axios = require("axios");
require("dotenv").config();

const credAreness = {
  "1207173311502439448": {
    SMS_API_USERNAME: "RechtehApiT",
    SMS_API_PASSWORD: "Areness@76543210",
    SMS_API_FROM: "RECARZ",
    SMS_API_INDIA_DLT_PRINCIPAL_ENTITY_ID: "1001221466140132939",
    Telemarketer_ID: "1202163221429156518",
  },
};

async function sendSmsToRecipient(
  to,
  text,
  indiaDltContentTemplateId = "1207173311502439448"
) {
  const apiUrl = `https://api2.nexgplatforms.com/sms/1/text/query`;

  const params = new URLSearchParams({
    username: credAreness[indiaDltContentTemplateId].SMS_API_USERNAME,
    password: credAreness[indiaDltContentTemplateId].SMS_API_PASSWORD,
    from: credAreness[indiaDltContentTemplateId].SMS_API_FROM,
    to: `+91${to}`,
    text,
    indiaDltContentTemplateId,
    indiaDltTelemarketerId:
      credAreness[indiaDltContentTemplateId].Telemarketer_ID,
    indiaDltPrincipalEntityId:
      credAreness[indiaDltContentTemplateId]
        .SMS_API_INDIA_DLT_PRINCIPAL_ENTITY_ID,
  }).toString();

  try {
    const response = await axios.get(`${apiUrl}?${params}`);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("Network Error: No response received from SMS API");
    } else {
      console.error("Unexpected Error:", error.message);
    }
    throw error;
  }
}

// Function to send OTP via NexG SMS API
// const sendOtpToNumber = async (otp, respondentMobile) => {
//   //   const apiUrl = "https://api2.nexgplatforms.com/sms/1/text/query";
//   //   const username = "YOUR_USERNAME"; // Replace with your NexG username
//   //   const password = "YOUR_PASSWORD"; // Replace with your NexG password
//   //   const senderId = "YOUR_SENDER_ID"; // Replace with your DLT-approved Sender ID
//   //   const templateId = "YOUR_TEMPLATE_ID"; // Replace with your DLT-approved Template ID
//   //   const principalEntityId = "YOUR_PE_ID"; // Replace with your Principal Entity ID
//   const message = `Your OTP for Sandhee Portal is ${otp}. It is valid for 10 mins. Please do not share it with anyone. Team RecQARZ`; // Ensure this message matches your DLT-approved template

//   try {
//     const response = await axios.get(process.env.NEXG_BASE_URL, {
//       params: {
//         username: process.env.NEXG_USER_NAME,
//         password: process.env.NEXG_PASSWORD,
//         from: process.env.NEXG_SENDER_ID,
//         to: respondentMobile,
//         indiaDltContentTemplateId: process.env.NEXG_TEMPLATE_ID,
//         indiaDltPrincipalEntityId: process.env.NEXG_PRINCIPAL_ENTITY_ID,
//         text: message,
//       },
//     });

//     if (
//       response.data &&
//       response.data.messages[0].status.name === "PENDING_ENROUTE"
//     ) {
//       console.log("OTP sent successfully!", response.data);
//     } else {
//       console.error(
//         "Failed to send OTP:",
//         response.data.messages[0].status.description
//       );
//     }
//   } catch (error) {
//     console.error("Error sending OTP:", error.message);
//   }
// };

module.exports = { sendSmsToRecipient };
