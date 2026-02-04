import mongoose from "mongoose";

const creditSchema = new mongoose.Schema({
  paymentId: { type: String,  },
  amount: { type: Number, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  ethiopianDate: { type: String, default: '' }
});

export default mongoose.model("Credit", creditSchema);