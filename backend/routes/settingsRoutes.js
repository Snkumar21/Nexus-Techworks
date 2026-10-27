import { Router } from "express";
import multer from "multer";
import SiteSettings from "../models/SiteSettings.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024, files: 1, },
    fileFilter(req, file, callback) {
        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/webp",
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return callback(
                new Error("Only PNG, JPG and WebP images are allowed.")
            );
        }
        callback(null, true);
    },
});

const defaults = {
    company: {
        name: "Nexus Techworks",
        tagline: "KEEP EVOLVING",
        email: "nexustechworks30@gmail.com",
        phone: "+91 93739 37166",
        address: "Pune, Maharashtra, India",
        website: "https://www.nexustechworks.live/",
    },
    admin: {
        name: "Nexus Administrator",
        designation: "Administrator",
        email: "snkumar6926@gmail.com",
        phone: "+91 93739 37166",
    },
    social: {
        linkedin: "https://www.linkedin.com/company/nexus-techworks/",
        instagram: "https://www.instagram.com/nexustechworks/",
        facebook: "https://www.facebook.com/profile.php?id=61593920057034",
        youtube: "https://www.youtube.com/channel/UCoh5uueXF2KBgHPnpITqZyA",
        github: "https://github.com/nexustechworks",
    },
    preferences: {
        maintenanceMode: false,
        showSocialLinks: true,
    },
};

const editableSections = [ "company", "admin", "social", "preferences", ];
const allowedFields = {
    company: ["name", "tagline", "email", "phone", "address", "website"],
    admin: ["name", "designation", "email", "phone"],
    social: ["linkedin", "instagram", "facebook", "youtube", "github"],
    preferences: ["maintenanceMode", "showSocialLinks"],
};
const getSettings = async () => {
    let settings = await SiteSettings.findOne({ key: "main" });
    if (!settings) {
        settings = await SiteSettings.create({ key: "main" });
    }
    return settings;
};

const serializeSettings = (settings) => {
    const result = {};

    for (const section of editableSections) {
        result[section] = {
            ...defaults[section],
            ...(settings[section]?.toObject?.() ?? settings[section] ?? {}),
        };
    }

    result.logoUrl = settings.logo?.contentType
        ? "/api/settings/logo"
        : "";

    result.logoUpdatedAt = settings.logo?.updatedAt ?? null;

    return result;
};

// Public read-only settings for the website navbar/footer.

router.get("/public", async (req, res, next) => {
    try {
        const settings = await getSettings();
        const data = serializeSettings(settings);

        res.set("Cache-Control", "no-store");

        return res.json({
            company: data.company,
            social: data.social,
            preferences: data.preferences,
            logoUrl: data.logoUrl,
            logoUpdatedAt: data.logoUpdatedAt,
        });
    } catch (error) {
        next(error);
    }
});

// Public logo endpoint. Only serves validated raster image types.

router.get("/logo", async (req, res, next) => {
    try {
        const settings = await SiteSettings.findOne({ key: "main" })
        .select("+logo.data +logo.contentType +logo.updatedAt")
        .exec();

        const logo = settings?.logo;

        if (!logo?.data || !logo.contentType) {
        return res.status(404).json({
            message: "Logo data not found in MongoDB.",
        });
        }

        const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

        if (!allowedTypes.includes(logo.contentType)) {
        return res.status(415).json({
            message: "Unsupported logo image type.",
        });
        }

        const imageBuffer = Buffer.isBuffer(logo.data)
        ? logo.data
        : Buffer.from(logo.data);

        if (imageBuffer.length === 0) {
        return res.status(404).json({
            message: "Logo image is empty.",
        });
        }

        res.set({
        "Content-Type": logo.contentType,
        "Content-Length": String(imageBuffer.length),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        });

        return res.status(200).send(imageBuffer);
    } catch (error) {
        console.error("Logo fetch error:", error);
        next(error);
    }
});

// Admin-only settings read.
router.get("/", requireAdmin, async (req, res, next) => {
    try {
        const settings = await getSettings();
        res.set("Cache-Control", "no-store");
        res.json({ settings: serializeSettings(settings) });
    } catch (error) { next(error); }
});

// Admin-only settings update. Only explicitly permitted fields are accepted.
router.put("/", requireAdmin, async (req, res, next) => {
    try {
        const body = req.body;
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return res.status(400).json({ message: "Invalid settings payload." });
        }
        const update = {};
        for (const section of editableSections) {
            if (body[section] === undefined) continue;
            if (
                !body[section] ||
                typeof body[section] !== "object" ||
                Array.isArray(body[section])
            ) {
                return res.status(400).json({ 
                    message: `Invalid ${section} settings.`, 
                }); 
            }
            for (const [field, value] of Object.entries(body[section])) {
                if (!allowedFields[section].includes(field)) {
                    return res.status(400).json({
                        message: `Field not allowed: ${section}.${field}`,
                    });
                }
                if (section === "preferences") {
                    if (typeof value !== "boolean") {
                        return res.status(400).json({
                        message: `${field} must be true or false.`,
                        });
                    }
                } else if (typeof value !== "string" || value.length > 1000) {
                    return res.status(400).json({
                        message: `${field} must be text under 1000 characters.`,
                    });
                }
                const path = `${section}.${field}`;
                update[path] = typeof value === "string" ? value.trim() : value;
            }
        }

        const settings = await SiteSettings.findOneAndUpdate(
            { key: "main" },
            { $set: update, $setOnInsert: { key: "main" } },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        // Keep the active session profile in sync with the editable admin name.
        if (update["admin.name"]) {
            req.session.user.name = update["admin.name"];
        }

        res.json({
            success: true,
            message: "Settings saved successfully.",
            settings: serializeSettings(settings),
        });
    } catch (error) { next(error); }
});

// Admin-only logo upload.
router.post(
    "/logo",
    requireAdmin,
    upload.single("logo"),
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Select a logo image first." });
            }

            const settings = await SiteSettings.findOneAndUpdate(
                { key: "main" },
                {
                    $set: {
                        "logo.data": req.file.buffer,
                        "logo.contentType": req.file.mimetype,
                        "logo.updatedAt": new Date(),
                    },
                    $setOnInsert: { key: "main" },
                },
                { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
            );

            res.json({
                success: true,
                message: "Logo uploaded successfully.",
                logoUrl: `/api/settings/logo?v=${Date.now()}`,
                logoUpdatedAt: settings.logo?.updatedAt ?? new Date(),
            });
        } catch (error) { next(error); }
    }
);
export default router;