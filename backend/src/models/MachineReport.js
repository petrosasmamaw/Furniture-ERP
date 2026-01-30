const mongoose = require("mongoose");

const machineReportSchema = new mongoose.Schema({
  machine: { type: mongoose.Schema.Types.ObjectId, ref: "Machine" },
  description: String,
  statusChange: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MachineReport", machineReportSchema);