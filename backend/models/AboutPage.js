import mongoose from "mongoose";

const aboutPageSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            default: "about",
            unique: true,
            immutable: true,
        },
        heroTitle: {
            type: String,
            default: "We build ideas",
            trim: true,
        },
        heroAccent: {
            type: String,
            default: "that evolve.",
            trim: true,
        },
        heroDescription: {
            type: String,
            default: "Nexus Techworks is a technology, digital and business solutions company focused on turning ideas into meaningful digital experiences.",
            trim: true,
        },
        introLead: {
            type: String,
            default: "Nexus Techworks was built with a simple idea: technology should help people and businesses move forward.",
            trim: true,
        },
        vision: {
            type: String,
            default: "We envision a future where businesses of every size can use technology and digital innovation to create meaningful opportunities, solve problems and grow with confidence.",
            trim: true,
        },
        mission: {
            type: String,
            default: "Our mission is to create practical, innovative and accessible solutions that combine technology, creativity and business strategy.",
            trim: true,
        },
        founderBio: {
            type: String,
            default: "I'm a technology-focused professional and the founder of Nexus Techworks, passionate about building practical digital solutions that solve real business problems.",
            trim: true,
        },
        founderMessage: {
            type: String,
            default: "Every great digital product starts with a problem worth solving, an idea worth exploring, and the willingness to keep evolving.",
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.AboutPage || mongoose.model("AboutPage", aboutPageSchema);