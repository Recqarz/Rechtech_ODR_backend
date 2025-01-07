const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: () => new Date().toISOString(),
  },
  query: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "open",
  },
  closerName: {
    type: String,
    default: "",
  },
  resolution: {
    type: String,
    default: "",
  },
});

const TICKET = mongoose.model("Ticket", ticketSchema);

module.exports = { TICKET };
