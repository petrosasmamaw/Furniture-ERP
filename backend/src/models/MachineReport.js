import mongoose from "mongoose";

const machineReportSchema = new mongoose.Schema({
  machine: { type: mongoose.Schema.Types.ObjectId, ref: "Machine" },
  description: String,
  statusChange: String,
  date: { type: Date, default: Date.now },
  worker: { type: String },
});

export default mongoose.model("MachineReport", machineReportSchema);