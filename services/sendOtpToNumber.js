const { default: axios } = require("axios");
require("dotenv").config();

async function sendSmsToRecipient(to, text) {
  const apiUrl = `https://api2.nexgplatforms.com/sms/1/text/query`;

  const params = new URLSearchParams({
    username: process.env.NEXG_SMS_API_USERNAME,
    password: process.env.NEXG_SMS_API_PASSWORD,
    from: process.env.NEXG_SMS_API_FROM,
    to: `+91${to}`,
    text,
    indiaDltContentTemplateId: process.env.NEXG_INDIAN_DLT_CONTENT_TEMPLATE_ID,
    indiaDltTelemarketerId: process.env.NEXG_TELEMARKETER_ID,
    indiaDltPrincipalEntityId:
      process.env.NEXG_SMS_API_INDIA_DLT_PRINCIPAL_ENTITY_ID,
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

module.exports = { sendSmsToRecipient };
