const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serialNumber: { type: String, unique: true },
  description: String,
  price: Number,
  status: {
    type: String,
    enum: ["In Store", "In Hand of Worker", "In Maintenance"],
    default: "In Store"
  }
}, { timestamps: true });

module.exports = mongoose.model("Machine", machineSchema);