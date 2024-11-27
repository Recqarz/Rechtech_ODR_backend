const mongoose = require("mongoose");

const caseDataSchema = new mongoose.Schema(
  {
    clientName: String,
    clientId: String,
    clientEmail: String,
    fileName: String,
    caseCount: Number,
    meetLinks: {
      type: [String],
      default: [],
    },
    meetId: {
      type: [String],
      default: [],
    },
    uploadDate: {
      type: Date,
      default: Date.now(),
    },
    arbitrator: {
      type: String,
      default: "",
    },
    arbitratorId: {
      type: String,
      default: "",
    },
    arbitratorEmail: {
      type: String,
      default: "",
    },
    defaulters: {
      type: [
        {
          name: {
            type: String,
            required: true,
            default: "",
          },
          emailId: {
            type: String,
            required: true,
            default: "",
          },
          contactNo: {
            type: String,
            required: true,
            default: "",
          },
          amount: {
            type: Number,
            required: true,
            default: 0,
          },
          accountNo: {
            type: String,
            required: true,
          },
          caseStatus: {
            type: String,
            required: true,
            default: "Pending",
          },
          decision: {
            type: String,
            default: "",
          },
          decisionDate: {
            type: Date,
            default: null,
          },
          remarks: {
            type: String,
            default: "",
          },
          isArbitrated: {
            type: Boolean,
            default: false,
          },
          isPaid: {
            type: Boolean,
            default: false,
          },
          isClosed: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  },
  { strict: false, timestamps: true }
);

const CASEDATA = mongoose.model("CaseData", caseDataSchema);

module.exports = { CASEDATA };
