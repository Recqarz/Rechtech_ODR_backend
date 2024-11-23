const { addCase, getAutoCaseId } = require("./case.controller");

const caseRoute = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

caseRoute.post("/add-case", upload.array("attachments"), addCase);

caseRoute.post("/auto-caseid", getAutoCaseId);

module.exports = { caseRoute };
