const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  phone: String,
  balance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Worker", workerSchema);