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

// Middleware to handle async route handlers with error catching
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Configure multer storage for basic uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads"); // Fix path to resolve directory
    console.log("Upload directory:", uploadDir); // Debug log for path
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${file.originalname}`;
    console.log("File upload:", uniqueSuffix); // Debug log for filename
    cb(null, uniqueSuffix);
  },
});

// Configure multer for file upload
const upload = multer({ storage });

// File filter to restrict allowed file types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/pdf", // .pdf
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only Excel or PDF files are allowed."),
      false
    );
  }
};

// Additional multer configuration for bulk upload
const storages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Temporary upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Configure bulk upload with file filter
const uploads = multer({ storage: storages, fileFilter });

// Fixed route configuration
caseRoute.post("/addcase", upload.array("files"), asyncHandler(addCase));
caseRoute.use("/bulkupload", bulkAddCasesRoute);
caseRoute.put("/updatemeetstatus", asyncHandler(updateMeetStatus));
caseRoute.get("/auto-caseid", asyncHandler(getAutoCaseId));
caseRoute.get("/all-cases", asyncHandler(getAllCases));
caseRoute.get("/arbitratorcases", asyncHandler(arbitratorCases));
caseRoute.get("/clientcases", asyncHandler(clientCases));
caseRoute.get("/casewithaccountnumber/:accountNumber", asyncHandler(caseWithAccountNumber));
caseRoute.get("/allrespondentcases", asyncHandler(allRespondentCases));
caseRoute.post("/uploadawards", uploads.single("file"), asyncHandler(addAward));

// Global error handling middleware
caseRoute.use((err, req, res, next) => {
  console.error("Error:", err); // Log the error
  if (err instanceof multer.MulterError || err.message.includes("Invalid file type")) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = { caseRoute };
