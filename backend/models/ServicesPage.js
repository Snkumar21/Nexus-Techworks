import mongoose from "mongoose";

const processStepSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const pageSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "services",
    },

    heroLabel: String,
    heroTitle: String,
    heroAccent: String,
    heroDescription: String,

    pricingLabel: String,
    pricingTitle: String,
    pricingAccent: String,
    pricingDescription: String,
    pricingNote: String,

    serviceButtonText: String,
    serviceLink: String,

    processLabel: String,
    processTitle: String,
    processAccent: String,
    processDescription: String,
    processSteps: [processStepSchema],

    ctaLabel: String,
    ctaTitle: String,
    ctaAccent: String,
    ctaDescription: String,
    ctaButtonText: String,
    ctaLink: String,
  },
  { timestamps: true }
);

export default mongoose.model("ServicesPage", pageSchema);