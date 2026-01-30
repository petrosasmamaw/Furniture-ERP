const mongoose = require("mongoose");

const reserveItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  item: { type: String, required: true },
  amount: { type: Number, required: true },
  description: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ReserveItem", reserveItemSchema);