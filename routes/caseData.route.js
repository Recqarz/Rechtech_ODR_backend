const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Create folder if it doesn't exist
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const {
  handleCaseData,
  handleGetCaseData,
  handleGetOneCaseData,
  arbitratorCases,
  clientCases,
} = require("../controllers/caseData.controller");

const caseDataRoute = require("express").Router();

caseDataRoute.post("/", upload.single("excelFile"), handleCaseData);

caseDataRoute.get("/", handleGetCaseData);

caseDataRoute.get("/specific/:id", handleGetOneCaseData);

caseDataRoute.get("/arbitratorcases", arbitratorCases);

caseDataRoute.get("/clientcases", clientCases);

module.exports = { caseDataRoute };
