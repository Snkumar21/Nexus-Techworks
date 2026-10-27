import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        enquiry: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enquiry",
            default: null,
            unique: true,
            sparse: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },
        logo: {
            type: String,
            default: "",
            trim: true,
            maxlength: 2048,
        },
        service: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },
        website: {
            type: String,
            default: "",
            trim: true,
            maxlength: 2048,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

clientSchema.index({ isPublished: 1, createdAt: -1 });

export default mongoose.models.Client || mongoose.model("Client", clientSchema);