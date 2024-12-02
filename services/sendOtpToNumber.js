const axios = require("axios");
require("dotenv").config();

// Function to send OTP via NexG SMS API
const sendOtpToNumber = async (otp, respondentMobile) => {
  //   const apiUrl = "https://api2.nexgplatforms.com/sms/1/text/query";
  //   const username = "YOUR_USERNAME"; // Replace with your NexG username
  //   const password = "YOUR_PASSWORD"; // Replace with your NexG password
  //   const senderId = "YOUR_SENDER_ID"; // Replace with your DLT-approved Sender ID
  //   const templateId = "YOUR_TEMPLATE_ID"; // Replace with your DLT-approved Template ID
  //   const principalEntityId = "YOUR_PE_ID"; // Replace with your Principal Entity ID
  const message = `Your OTP for Sandhee Portal is ${otp}. It is valid for 10 mins. Please do not share it with anyone. Team RecQARZ`; // Ensure this message matches your DLT-approved template

  try {
    const response = await axios.get(process.env.NEXG_BASE_URL, {
      params: {
        username: process.env.NEXG_USER_NAME,
        password: process.env.NEXG_PASSWORD,
        from: process.env.NEXG_SENDER_ID,
        to: respondentMobile,
        indiaDltContentTemplateId: process.env.NEXG_TEMPLATE_ID,
        indiaDltPrincipalEntityId: process.env.NEXG_PRINCIPAL_ENTITY_ID,
        text: message,
      },
    });

    if (
      response.data &&
      response.data.messages[0].status.name === "PENDING_ENROUTE"
    ) {
      console.log("OTP sent successfully!", response.data);
    } else {
      console.error(
        "Failed to send OTP:",
        response.data.messages[0].status.description
      );
    }
  } catch (error) {
    console.error("Error sending OTP:", error.message);
  }
};

module.exports = { sendOtpToNumber };
