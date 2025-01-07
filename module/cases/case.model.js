const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
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
    amount: {
      type: String,
      default: "",
    },
    accountNumber: {
      type: String,
      default: "",
    },
    cardNo: {
      type: String,
      default: "",
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
      type: [Object],
      default: [],
    },
    orderSheet: {
      type: [String],
      default: [],
    },
    awards: {
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
  },
  { timestamps: true }
);

const CASES = mongoose.model("Newcase", caseSchema);

module.exports = { CASES };
