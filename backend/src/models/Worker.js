import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  phone: String,
  balance: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Worker", workerSchema);