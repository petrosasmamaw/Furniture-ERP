import mongoose from "mongoose";

const balanceReportSchema = new mongoose.Schema({
  paymentId: { type: String, required: true },
  type: { type: String, enum: ["Added", "Used"], required: true },
  amount: { type: Number, required: true },
  description: String,
  remainingBalance: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  ethiopianDate: { type: String, default: '' }
});

export default mongoose.model("BalanceReport", balanceReportSchema);