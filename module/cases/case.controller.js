const path = require("path");
const fs = require("fs");
const { uploadFileToS3 } = require("../../utils/fileUtils");
const { CASES } = require("./case.model");
const { USER } = require("../users/user.model");
const jwt = require("jsonwebtoken");
const { sendEmailsforCases } = require("../../services/sendemailforcases");

const addCase = async (req, res) => {
  try {
    const caseData = JSON.parse(req.body.caseData);
    const fileNames = req.body.fileNames;
    const attachments = [];

    // Process files if they exist
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const fileName = Array.isArray(fileNames) ? fileNames[i] : fileNames;
        const filePath = path.join(__dirname, "../../uploads", file.filename);

        try {
          // Upload the file to S3
          const s3Response = await uploadFileToS3(filePath, file.originalname);

          // Save file metadata
          attachments.push({
            name: fileName || file.originalname,
            url: s3Response.Location,
          });

          // Delete the local file after upload
          fs.unlinkSync(filePath);
        } catch (uploadError) {
          console.error("Error uploading file to S3:", uploadError);
          // Continue with the next file if one fails
        }
      }
    }

    const clientId = caseData.clientId;
    const client = await USER.findById(clientId);
    if (!client) {
      throw new Error("Client not found");
    }
    let noOfcase = parseInt(client.caseAdded) + 1;
    client.caseAdded = noOfcase;
    await client.save();

    // Create new case with the parsed data
    const newCase = new CASES({
      ...caseData,
      attachments,
    });

    await newCase.save();
    const {respondentEmail, respondentName} = caseData;
    sendEmailsforCases(respondentName, respondentEmail);
    res.status(201).json({
      success: true,
      message: "Case added successfully",
      case: newCase,
    });
  } catch (err) {
    console.error("Error saving case:", err);

    // Cleanup: Delete temporary files if they exist
    if (req.files) {
      req.files.forEach((file) => {
        const filePath = path.join(__dirname, "../../uploads", file.filename);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (unlinkError) {
            console.error("Error deleting temporary file:", unlinkError);
          }
        }
      });
    }

    res.status(500).json({
      success: false,
      message: "Error adding case",
      error: err.message,
    });
  }
};

const getAutoCaseId = async (req, res) => {
  try {
    const allcases = await CASES.find({});
    let count = allcases.length + 1;
    let paddedCount = count.toString().padStart(2, "0");
    let caseId = "CS" + paddedCount;
    res.status(200).json({ data: caseId });
  } catch (err) {
    console.error("Error generating auto ID:", err.message);
    res.status(500).send("Internal Server Error: " + err.message);
  }
};

const getAllCases = async (req, res) => {
  try {
    const data = await CASES.find().sort({ _id: -1 });
    return res.status(200).json({ cases: data });
  } catch (err) {
    console.error("Error getting all cases:", err.message);
    return res.status(500).send("Internal Server Error: " + err.message);
  }
};

const arbitratorCases = async (req, res) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  try {
    const decoded = jwt.verify(
      token?.split(" ")[1],
      process.env.JWT_SECRET_KEY
    );
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const id = decoded.id;
    const caseData = await CASES.find({ arbitratorId: id }).sort({ _id: -1 });
    if (!caseData) {
      return res.status(404).json({ message: "Case data not found" });
    }
    res.status(200).json({ caseData });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const clientCases = async (req, res) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  try {
    const decoded = jwt.verify(
      token?.split(" ")[1],
      process.env.JWT_SECRET_KEY
    );
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const id = decoded.id;
    const user = await USER.findById(id);
    if (!user) {
      return res.status(402).json({ message: "Invalid user id" });
    }
    const caseData = await CASES.find({ clientId: user.uid }).sort({ _id: -1 });
    if (!caseData) {
      return res.status(404).json({ message: "Case data not found" });
    }
    res.status(200).json({ caseData });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addCase,
  getAutoCaseId,
  getAllCases,
  arbitratorCases,
  clientCases,
};
