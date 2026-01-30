const mongoose = require("mongoose");

const creditSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true },
  amount: { type: Number, required: true },
  description: String,
  status: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Credit", creditSchema);