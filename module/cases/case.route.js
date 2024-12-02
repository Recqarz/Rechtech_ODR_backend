// route.js
const {
  addCase,
  getAutoCaseId,
  getAllCases,
  arbitratorCases,
  clientCases,
  caseWithAccountNumber,
  allRespondentCases,
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
// cashRoute.post("/")

module.exports = { caseRoute };
