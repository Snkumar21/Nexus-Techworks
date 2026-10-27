import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
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
        company: {
            type: String,
            trim: true,
            default: "",
            maxlength: 160,
        },
        service: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },
        budget: {
            type: String,
            trim: true,
            default: "",
            maxlength: 100,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },
        status: {
            type: String,
            enum: [
                "New",
                "Contacted",
                "Quotation Sent",
                "Negotiation",
                "Won",
                "Lost",
            ],
            default: "New",
        },
        
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            default: null,
        },
        emails: [
            {
                type: {
                    type: String,
                    enum: ["Reply", "Quotation"],
                    required: true,
                },
                subject: { type: String, required: true, maxlength: 200 },
                body: { type: String, required: true, maxlength: 15000 },
                sentAt: { type: Date, default: Date.now },
                sentBy: { type: String, default: "Admin", maxlength: 120 },
            },
        ],
        quotation: {
            amount: { type: Number, min: 0 },
            currency: { type: String, default: "INR", maxlength: 3 },
            items: [
                {
                    description: { type: String, trim: true, maxlength: 250 },
                    amount: { type: Number, min: 0 },
                },
            ],
            timeline: { type: String, trim: true, maxlength: 500 },
            terms: { type: String, trim: true, maxlength: 3000 },
            sentAt: Date,
        },
    },
    { timestamps: true }
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ email: 1 });

export default mongoose.models.Enquiry ||
    mongoose.model("Enquiry", enquirySchema);