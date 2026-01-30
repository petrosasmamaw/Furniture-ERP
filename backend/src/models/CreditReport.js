import mongoose from "mongoose";

const creditReportSchema = new mongoose.Schema({
  paymentId: { type: String, required: true },
  type: { type: String, enum: ["Credit Taken", "Credit Paid"], required: true },
  amount: { type: Number, required: true },
  description: String,
  remainingCredit: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("CreditReport", creditReportSchema);  