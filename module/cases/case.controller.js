const path = require("path");
const fs = require("fs");
const { uploadFileToS3 } = require("../../utils/fileUtils");
const { CASES } = require("./case.model");

const addCase = async (req, res) => {
  const {
    caseId,
    clientName,
    clientId,
    clientEmail,
    clientAddress,
    clientMobile,
    respondentName,
    respondentEmail,
    respondentAddress,
    respondentMobile,
    disputeType,
  } = req.body;
  const attachments = [];
  try {
    for (const file of req.files) {
      const filePath = path.join(__dirname, "../uploads", file.filename);

      // Upload the file to S3
      const s3Response = await uploadFileToS3(filePath, file.originalname);

      // Save file metadata
      attachments.push({
        name: file.originalname,
        url: s3Response.Location,
      });

      // Delete the file from the server
      fs.unlinkSync(filePath);
    }

    // Save case details along with attachments
    const newCase = new CASES({
      caseId,
      clientName,
      clientId,
      clientEmail,
      clientAddress,
      clientMobile,
      respondentName,
      respondentEmail,
      respondentAddress,
      respondentMobile,
      disputeType,
      attachments,
    });

    await newCase.save();
    res.status(201).json({ message: "Case added successfully", case: newCase });
  } catch (err) {
    console.error("Error saving case:", err.message);

    // Cleanup: Delete temporary files if there's an error
    if (req.files) {
      req.files.forEach((file) => {
        const filePath = path.join(__dirname, "../uploads", file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    res.status(500).send("Internal Server Error: " + err.message);
  }
};

const getAutoCaseId = async (req, res) => {
  try {
    const allcases = await CASES.find({});
    res.status(200).json({ data: allcases.length });
  } catch (err) {
    console.error("Error generating auto ID:", err.message);
    res.status(500).send("Internal Server Error: " + err.message);
  }
};

module.exports = { addCase, getAutoCaseId };
