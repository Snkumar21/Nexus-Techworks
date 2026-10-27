import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },
        type: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        skills: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        published: {
            type: Boolean,
            default: false,
        },
        sortOrder: {
            type: Number,
            default: 0,
            min: 0,
            validate: Number.isInteger,
        },
    },
    { timestamps: true }
);

careerSchema.index({ published: 1, sortOrder: 1 });
export default mongoose.models.Career || mongoose.model("Career", careerSchema);