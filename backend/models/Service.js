import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }, // USD base price
  priceType: { type: String, enum: ["starting", "monthly"], default: "starting" },
  published: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model("Service", serviceSchema);