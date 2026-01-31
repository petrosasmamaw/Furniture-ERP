import mongoose from "mongoose";

const creditSchema = new mongoose.Schema({
  paymentId: { type: String,  },
  amount: { type: Number, required: true },
  description: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Credit", creditSchema);