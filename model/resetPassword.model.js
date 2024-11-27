const mongoose = require("mongoose");
const passwordSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      require: true,
    },
    otp: {
      type: String,
      require: true,
    },
    time: {
      type: Date,
      require: true,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const PASSWORDRESET = mongoose.model("password", passwordSchema);

module.exports = { PASSWORDRESET };
