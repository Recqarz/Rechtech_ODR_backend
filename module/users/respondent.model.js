const mongoose = require("mongoose");

const respondentSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    respondentMobile: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const RESPONDENT = mongoose.model("Respondent", respondentSchema);

module.exports = { RESPONDENT };
