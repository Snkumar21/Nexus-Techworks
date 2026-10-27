import { Router } from "express";
import AboutPage from "../models/AboutPage.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();
const DEFAULT_ABOUT_CONTENT = {
    heroTitle: "We build ideas",
    heroAccent: "that evolve.",
    heroDescription: "Nexus Techworks is a technology, digital and business solutions company focused on turning ideas into meaningful digital experiences.",
    introLead: "Nexus Techworks was built with a simple idea: technology should help people and businesses move forward.",
    vision: "We envision a future where businesses of every size can use technology and digital innovation to create meaningful opportunities, solve problems and grow with confidence.",
    mission: "Our mission is to create practical, innovative and accessible solutions that combine technology, creativity and business strategy.",
    founderBio: "I'm a technology-focused professional and the founder of Nexus Techworks, passionate about building practical digital solutions that solve real business problems.",
    founderMessage: "Every great digital product starts with a problem worth solving, an idea worth exploring, and the willingness to keep evolving.",
};

const editableFields = Object.keys(DEFAULT_ABOUT_CONTENT);

// Verify CSRF token for state-changing admin requests.
function verifyAdminCsrf(req, res, next) {
    const sessionToken = req.session?.csrfToken;
    const requestToken = req.get("X-CSRF-Token");
    if ( !sessionToken || !requestToken || sessionToken !== requestToken ) {
        return res.status(403).json({
            message: "Invalid or missing CSRF token. Please refresh your admin session.",
        });
    }
    next();
}

// Public: fetch About page content.
router.get("/page", async (req, res, next) => {
    try {
        const page = await AboutPage.findOne({ key: "about" }).lean();
        res.set("Cache-Control", "no-store");
        return res.json({ page: page || null });
    } catch (error) {
        next(error);
    }
});

// Admin: fetch saved About content.
router.get("/admin/page", requireAdmin, async (req, res, next) => {
    try {
        const page = await AboutPage.findOne({ key: "about" }).lean();
        return res.json({
            page: page || DEFAULT_ABOUT_CONTENT,
        });
    } catch (error) {
        next(error);
    }
});

// Admin: save About content.
router.put(
    "/admin/page",
    requireAdmin,
    verifyAdminCsrf,
    async (req, res, next) => {
        try {
            const payload = {};
            for (const field of editableFields) {
                const value = req.body?.[field];

                if (typeof value !== "string") {
                    return res.status(400).json({
                        message: `Invalid or missing field: ${field}`,
                    });
                }

                const cleanedValue = value.trim();

                if (!cleanedValue) {
                    return res.status(400).json({
                        message: `${field} cannot be empty.`,
                    });
                }

                if (cleanedValue.length > 5000) {
                    return res.status(400).json({
                        message: `${field} is too long.`,
                    });
                }

                payload[field] = cleanedValue;
            }

            const page = await AboutPage.findOneAndUpdate(
                { key: "about" },
                {
                    $set: payload,
                    $setOnInsert: { key: "about" },
                },
                {
                    new: true,
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert: true,
                }
            ).lean();

            return res.json({
                success: true,
                message: "About page content saved successfully.",
                page,
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;