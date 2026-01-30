import mongoose from "mongoose";

const creditSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true },
  amount: { type: Number, required: true },
  description: String,
  status: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Credit", creditSchema);