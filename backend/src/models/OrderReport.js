const mongoose = require("mongoose");

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

module.exports = mongoose.model("OrderReport", orderReportSchema);