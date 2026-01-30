import mongoose from "mongoose";

const machineReportSchema = new mongoose.Schema({
  machine: { type: mongoose.Schema.Types.ObjectId, ref: "Machine" },
  description: String,
  statusChange: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("MachineReport", machineReportSchema);