import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { randomBytes } from "node:crypto";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        message: "Too many login attempts. Try again later.",
    },
});

router.post("/login", loginLimiter, async (req, res, next) => {
    try {
        const { email, password, rememberMe } = req.body ?? {};

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }

        const configuredEmail = process.env.ADMIN_EMAIL;
        const configuredHash = process.env.ADMIN_PASSWORD_HASH;

        if (!configuredEmail || !configuredHash) {
            return res.status(503).json({
                message: "Admin authentication is not configured.",
            });
        }

        const emailMatches =
            email.trim().toLowerCase() ===
            configuredEmail.trim().toLowerCase();

        const passwordMatches = await bcrypt.compare(
            password,
            configuredHash
        );

        if (!emailMatches || !passwordMatches) {
            return res.status(401).json({
                message: "Invalid administrator credentials.",
            });
        }

        req.session.regenerate((error) => {
            if (error) return next(error);

            req.session.user = {
                name: "Nexus Administrator",
                email: configuredEmail,
                role: "admin",
            };

            req.session.csrfToken = randomBytes(32).toString("hex");

            req.session.cookie.maxAge = rememberMe
                ? 7 * 24 * 60 * 60 * 1000
                : 8 * 60 * 60 * 1000;

            req.session.save((saveError) => {
                if (saveError) return next(saveError);

                res.json({
                    success: true,
                    user: req.session.user,
                    csrfToken: req.session.csrfToken,
                });
            });
        });
    } catch (error) {
        next(error);
    }
});

router.get("/me", requireAdmin, (req, res) => {
    res.set("Cache-Control", "no-store");

    res.json({
        authenticated: true,
        user: req.session.user,
        csrfToken: req.session.csrfToken,
    });
});

router.post("/logout", requireAdmin, (req, res, next) => {
    req.session.destroy((error) => {
        if (error) return next(error);

        res.clearCookie("nexus.sid", {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
        });

        res.json({ success: true });
    });
});

export default router;