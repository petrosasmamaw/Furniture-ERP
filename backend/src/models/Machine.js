import mongoose from "mongoose";

const machineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serialNumber: { type: String, unique: true },
  description: String,
  worker: { type: String },
  price: Number,
  status: {
    type: String,
    enum: ["In Store", "In Hand of Worker", "In Maintenance"],
    default: "In Store"
  }
}, { timestamps: true });

export default mongoose.model("Machine", machineSchema);