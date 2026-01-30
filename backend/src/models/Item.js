const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  itemId: { type: String, required: true, unique: true },
  description: String,
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);