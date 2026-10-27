import mongoose from "mongoose";
const siteSettingsSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            default: "main",
            unique: true,
            immutable: true,
        },
        company: {
            name: { type: String, default: "Nexus Techworks", trim: true },
            tagline: { type: String, default: "KEEP EVOLVING", trim: true },
            email: { type: String, default: "", trim: true },
            phone: { type: String, default: "", trim: true },
            address: { type: String, default: "", trim: true },
            website: { type: String, default: "", trim: true },
        },
        admin: {
            name: { type: String, default: "Nexus Administrator", trim: true },
            designation: { type: String, default: "Administrator", trim: true },
            email: { type: String, default: "", trim: true },
            phone: { type: String, default: "", trim: true },
        },
        social: {
            linkedin: { type: String, default: "", trim: true },
            instagram: { type: String, default: "", trim: true },
            facebook: { type: String, default: "", trim: true },
            youtube: { type: String, default: "", trim: true },
            github: { type: String, default: "", trim: true },
        },
        preferences: {
            maintenanceMode: { type: Boolean, default: false },
            showSocialLinks: { type: Boolean, default: true },
        },
        logo: {
            data: { type: Buffer, default: undefined, select: false },
            contentType: { type: String, default: "" },
            updatedAt: { type: Date, default: null },
        },
    },
    { timestamps: true, minimize: false }
);
export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", siteSettingsSchema);