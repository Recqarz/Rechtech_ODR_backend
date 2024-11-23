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
  attachments: {
    type: [Object],
    required: true,
    default: [],
  },
  mettings: {
    type: [Object],
    required: true,
    default: [],
  },
  arbitratorId: {
    type: String,
    required: true,
    default: "",
  },
  arbitratorName: {
    type: String,
    required: true,
    default: "",
  },
  arbitratorEmail: {
    type: String,
    required: true,
    default: "",
  },
  isFirstHearingDone: {
    type: Boolean,
    required: true,
    default: false,
  },
  isSecondHearingDone: {
    type: Boolean,
    required: true,
    default: false,
  },
  isMeetCompleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAwardCompleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  isCaseResolved: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const CASES = mongoose.model("Newcase", caseSchema);

module.exports = { CASES };
