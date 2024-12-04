const {
  addCase,
  getAutoCaseId,
  getAllCases,
  arbitratorCases,
  clientCases,
  caseWithAccountNumber,
  allRespondentCases,
  addAward,
  uploadOrderSheet,
} = require("./case.controller");
const express = require("express");
const caseRoute = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { updateMeetStatus } = require("../webex/webex.controller");
const { bulkAddCasesRoute } = require("./bulkupload.controller");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    console.log("Upload directory:", uploadDir);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${file.originalname}`;
    console.log("File upload:", uniqueSuffix);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["application/pdf"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF files are allowed."), false);
  }
};

const storages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const uploads = multer({ storage: storages, fileFilter });

caseRoute.post("/addcase", upload.array("files"), asyncHandler(addCase));
caseRoute.use("/bulkupload", bulkAddCasesRoute);
caseRoute.put("/updatemeetstatus", asyncHandler(updateMeetStatus));
caseRoute.get("/auto-caseid", asyncHandler(getAutoCaseId));
caseRoute.get("/all-cases", asyncHandler(getAllCases));
caseRoute.get("/arbitratorcases", asyncHandler(arbitratorCases));
caseRoute.get("/clientcases", asyncHandler(clientCases));
caseRoute.get(
  "/casewithaccountnumber/:accountNumber",
  asyncHandler(caseWithAccountNumber)
);
caseRoute.get("/allrespondentcases", asyncHandler(allRespondentCases));
caseRoute.post("/uploadawards", uploads.single("file"), asyncHandler(addAward));
caseRoute.post(
  "/uploadordersheet",
  uploads.single("file"),
  asyncHandler(uploadOrderSheet)
);

caseRoute.use((err, req, res, next) => {
  console.error("Error:", err);
  if (
    err instanceof multer.MulterError ||
    err.message.includes("Invalid file type")
  ) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = { caseRoute };
