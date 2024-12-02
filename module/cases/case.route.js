// route.js
const {
  addCase,
  getAutoCaseId,
  getAllCases,
  arbitratorCases,
  clientCases,
  caseWithAccountNumber,
  allRespondentCases,
  addAward,
} = require("./case.controller");
const express = require("express");
const caseRoute = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { updateMeetStatus } = require("../webex/webex.controller");
const { bulkAddCasesRoute } = require("./bulkupload.controller");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads"); // Fix path
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

const storages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Temporary upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/pdf', // .pdf
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel or PDF files are allowed.'), false);
  }
};

const uploads = multer({ storages, fileFilter });

// Fixed route configuration
caseRoute.post("/addcase", upload.array("files"), addCase);
caseRoute.use("/bulkupload", bulkAddCasesRoute);
caseRoute.put("/updatemeetstatus", updateMeetStatus);
caseRoute.get("/auto-caseid", getAutoCaseId);
caseRoute.get("/all-cases", getAllCases);
caseRoute.get("/arbitratorcases", arbitratorCases);
caseRoute.get("/clientcases", clientCases);
caseRoute.get("/casewithaccountnumber/:accountNumber", caseWithAccountNumber);
caseRoute.get("/allrespondentcases", allRespondentCases);
caseRoute.post("/uploadawards", uploads.single('file'), addAward);

module.exports = { caseRoute };
