const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  paymentType: { type: String, enum: ["Balance", "Credit"] },
  description: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Purchase", purchaseSchema);