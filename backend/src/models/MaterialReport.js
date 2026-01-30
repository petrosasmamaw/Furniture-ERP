import mongoose from "mongoose";

const materialReportSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  description: String,
  inQty: { type: Number, default: 0 },
  outQty: { type: Number, default: 0 },
  remainingStock: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("MaterialReport", materialReportSchema);