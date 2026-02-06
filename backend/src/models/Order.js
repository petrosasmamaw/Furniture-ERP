import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderName: { type: String, required: true },
  ethiopianStartDate: { type: String, default: '' },
  ethiopianFinishDate: { type: String, default: '' },
  paidAmount: { type: Number, default: 0 },
  unpaidAmount: { type: Number, default: 0 },
  assignedWorkers: { type: String },
  planOfWork: String,
  paymentCode: String,
  description: String
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);