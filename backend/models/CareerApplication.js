import mongoose from "mongoose";

const careerApplicationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254,
        },
        phone: {
            type: String,
            trim: true,
            default: "",
            maxlength: 30,
        },
        position: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },
        experience: {
            type: String,
            trim: true,
            default: "",
            maxlength: 50,
        },
        portfolio: {
            type: String,
            trim: true,
            default: "",
            maxlength: 500,
        },
        github: {
            type: String,
            trim: true,
            default: "",
            maxlength: 500,
        },
        linkedin: {
            type: String,
            trim: true,
            default: "",
            maxlength: 500,
        },
        resume: {
            storageKey: {
                type: String,
                required: true,
                select: false,
            },
            originalName: {
                type: String,
                required: true,
                maxlength: 255,
            },
            mimeType: {
                type: String,
                required: true,
                enum: [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ],
            },
            size: {
                type: Number,
                required: true,
                max: 5 * 1024 * 1024,
            },
        },
        status: {
            type: String,
            enum: [
                "New",
                "Reviewing",
                "Shortlisted",
                "Rejected",
                "Hired",
            ],
            default: "New",
        },
    },
    { timestamps: true }
);

careerApplicationSchema.index({ createdAt: -1 });
careerApplicationSchema.index({ status: 1 });
export default mongoose.models.CareerApplication || mongoose.model("CareerApplication", careerApplicationSchema);