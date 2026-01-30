const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true },
  amount: { type: Number, required: true },
  description: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Balance", balanceSchema);