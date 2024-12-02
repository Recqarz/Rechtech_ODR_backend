const bulkAddCasesRoute = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const { CASES } = require("./case.model");
const { sendEmailsforCases } = require("../../services/sendemailforcases");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

bulkAddCasesRoute.post("/", upload.single("excelFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const {
      clientName,
      clientId,
      clientEmail,
      clientAddress,
      clientMobile,
      disputeType,
    } = req.body;

    if (
      !clientName ||
      !clientId ||
      !clientEmail ||
      !clientAddress ||
      !clientMobile ||
      !disputeType
    ) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Client details are required" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const respondentData = xlsx.utils.sheet_to_json(sheet);

    if (respondentData.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Excel file is empty" });
    }
    const currentCaseCount = await CASES.countDocuments();

    const bulkInsertData = respondentData.map((ele, index) => {
      const caseNumber = currentCaseCount + index + 1;
      let caseId = `CS${caseNumber.toString().padStart(2, "0")}`;
      sendEmailsforCases(ele.Respondent, ele.EmailId);
      const attachments = ele.attachments
        ? ele.attachments.includes(",")
          ? ele.attachments.split(",").map((url, idx) => {
              const name = `file${idx + 1}`;
              return { name, url };
            })
          : [{ name: "file1", url: ele.attachments }]
        : [];
      return {
        caseId,
        clientName,
        clientId,
        clientEmail,
        clientAddress,
        clientMobile,
        respondentName: ele.Respondent,
        respondentEmail: ele.EmailId,
        respondentMobile: String(ele.RespondentMobile),
        amount: ele.Amount ? String(ele.Amount) : "",
        accountNumber: ele.AccountNumber ? String(ele.AccountNumber) : "",
        cardNo: ele.CardNo ? String(ele.CardNo) : "",
        disputeType: disputeType,
        respondentAddress: ele.Address,
        attachments,
        isFileUpload: true,
        fileName: req.file.originalname,
      };
    });

    // Insert all data into MongoDB
    await CASES.insertMany(bulkInsertData);

    // // Clean up the file after processing
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "File processed and data saved successfully",
      success: true,
      data: bulkInsertData,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error processing file:", error);
    return res.status(500).json({
      message: "Error processing file",
      error: error.message,
    });
  }
});

module.exports = { bulkAddCasesRoute };
