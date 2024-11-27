const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  caseId: {
    type: String,
    required: true,
    unique: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  clientEmail: {
    type: String,
    required: true,
  },
  clientAddress: {
    type: String,
    required: true,
  },
  clientMobile: {
    type: String,
    required: true,
  },
  respondentName: {
    type: String,
    required: true,
  },
  respondentAddress: {
    type: String,
    required: true,
  },
  respondentEmail: {
    type: String,
    required: true,
  },
  respondentMobile: {
    type: String,
    required: true,
  },
  disputeType: {
    type: String,
    required: true,
  },
  isArbitratorAssigned: {
    type: Boolean,
    default: false,
  },
  isFileUpload: {
    type: Boolean,
    default: false,
  },
  fileName: {
    type: String,
    default: "",
  },
  attachments: {
    type: [Object],
    default: [],
  },
  meetings: {
    type: [Object],
    default: [],
  },
  recordings: {
    type: [String],
    default: [],
  },
  arbitratorId: {
    type: String,
    default: "",
  },
  arbitratorName: {
    type: String,
    default: "",
  },
  arbitratorEmail: {
    type: String,
    default: "",
  },
  isFirstHearingDone: {
    type: Boolean,
    default: false,
  },
  isSecondHearingDone: {
    type: Boolean,
    default: false,
  },
  isMeetCompleted: {
    type: Boolean,
    default: false,
  },
  isAwardCompleted: {
    type: Boolean,
    default: false,
  },
  isCaseResolved: {
    type: Boolean,
    default: false,
  },
});

const CASES = mongoose.model("Newcase", caseSchema);

module.exports = { CASES };
