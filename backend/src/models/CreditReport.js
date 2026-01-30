const mongoose = require("mongoose");

const creditReportSchema = new mongoose.Schema({
  paymentId: { type: String, required: true },
  type: { type: String, enum: ["Credit Taken", "Credit Paid"], required: true },
  amount: { type: Number, required: true },
  description: String,
  remainingCredit: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CreditReport", creditReportSchema);  