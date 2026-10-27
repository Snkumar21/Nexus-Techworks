import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    category: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    tech: {
      type: [{ type: String, trim: true, maxlength: 60 }],
      default: [],
      validate: {
        validator: (items) => Array.isArray(items) && items.length <= 20 && items.every((item) => item.trim()),
        message: "Technology list must contain up to 20 non-empty items.",
      },
    },
    status: { type: String, required: true, trim: true, maxlength: 50, default: "Developed" },
    featured: { type: Boolean, default: false },
    link: { type: String, trim: true, default: "", maxlength: 500 },
    previewImage: { type: String, trim: true, default: "", maxlength: 1000, },
    published: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0, min: 0, validate: Number.isInteger },
  },
  { timestamps: true }
);

projectSchema.index({ published: 1, featured: 1, sortOrder: 1 });

export default mongoose.models.Project || mongoose.model("Project", projectSchema);