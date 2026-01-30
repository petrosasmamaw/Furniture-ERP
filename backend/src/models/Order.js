const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderName: { type: String, required: true },
  startDate: Date,
  finishDate: Date,
  paidAmount: { type: Number, default: 0 },
  unpaidAmount: { type: Number, default: 0 },
  assignedWorkers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Worker" }],
  planOfWork: String,
  paymentCode: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);