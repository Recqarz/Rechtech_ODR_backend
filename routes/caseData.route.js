const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
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
