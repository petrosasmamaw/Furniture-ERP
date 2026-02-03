import mongoose from "mongoose";

const reserveItemSchema = new mongoose.Schema({
  orderName: { type: String, required: true },
  itemId: { type: String, required: true },
  item: { type: String, required: true },
  amount: { type: Number, required: true },
  description: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("ReserveItem", reserveItemSchema);