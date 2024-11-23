const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    contactNo: {
      type: String,
      require: true,
      default: "",
    },
    emailId: {
      type: String,
      require: true,
      unique: true,
    },
    noOfAssignCase: {
      type: Number,
      require: true,
      default: 0,
    },
    caseAdded: {
      type: Number,
      require: true,
      default: 0,
    },
    status: {
      type: Boolean,
      require: true,
      default: true,
    },
    password: {
      type: String,
      require: true,
      default: "",
    },
    role: {
      type: String,
      require: true,
      enum: ["admin", "client", "arbitrator"],
      default: "client",
    },
    areaOfExperties: {
      type: String,
      default: "",
    },
    experienceInYears: {
      type: Number,
      default: 0,
    },
    uid: {
      type: String,
      unique: true,
      require: true,
    },
    about: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const USER = mongoose.model("User", userSchema);

module.exports = { USER };
