const mongoose = require("mongoose");

const balanceReportSchema = new mongoose.Schema({
  paymentId: { type: String, required: true },
  type: { type: String, enum: ["Added", "Used"], required: true },
  amount: { type: Number, required: true },
  description: String,
  remainingBalance: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BalanceReport", balanceReportSchema);