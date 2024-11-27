const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const EXPERTIES = mongoose.model("Expert", expertSchema);

module.exports = { EXPERTIES };
