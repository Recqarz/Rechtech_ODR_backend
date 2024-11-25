// route.js
const { addCase, getAutoCaseId, getAllCases } = require("./case.controller");
const express = require("express");
const caseRoute = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

// Fixed route configuration
caseRoute.post(
  "/addcase",
  upload.array("files"),
  (req, res, next) => {
    console.log("Request Body:", req.body);

    // Parse the caseData from JSON string back to object
    const caseData = JSON.parse(req.body.caseData);
    console.log("Parsed Case Data:", caseData);

    // Log the uploaded files
    console.log("Uploaded Files:", req.files);

    // Continue to the next middleware or function
    next();
  },
  addCase
);
caseRoute.get("/auto-caseid", getAutoCaseId);
caseRoute.get("/all-cases", getAllCases);

module.exports = { caseRoute };