import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true },
  amount: { type: Number, required: true },
  description: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Balance", balanceSchema);