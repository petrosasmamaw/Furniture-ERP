import mongoose from "mongoose";

const orderReportSchema = new mongoose.Schema({
  orderName: { type: String, required: true },
  itemId: String,
  itemsUsed: [
    {
      item: String,
      quantity: Number
    }
  ],
  progressPercent: { type: Number, min: 0, max: 100 },
  description: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("OrderReport", orderReportSchema);