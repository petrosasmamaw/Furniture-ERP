import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  itemId: { type: String, required: true, unique: true },
  description: String,
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("Item", itemSchema);