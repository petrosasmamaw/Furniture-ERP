import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
 itemsUsed: [
    {
      item: String,
      quantity: Number
    }
  ],
  price: { type: Number, required: true },
  paymentType: { type: String, enum: ["Balance", "Credit"] },
  paymentId: String,
  description: String,
  date: { type: Date, default: Date.now },
  ethiopianDate: { type: String, default: '' }
});

export default mongoose.model("Purchase", purchaseSchema);