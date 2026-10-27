import { Router } from "express";
import mongoose from "mongoose";
import Career from "../models/Career.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();
const handle = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
const fields = [ "title", "type", "description", "skills", "published", "sortOrder", ];
const pickFields = (body) =>
    Object.fromEntries(
        fields
            .filter((key) =>
                Object.prototype.hasOwnProperty.call(body, key)
            )
        .map((key) => [key, body[key]])
    );
const validateCareer = (body, partial = false) => {
    const requiredStrings = [ "title", "type", "description", "skills", ];
    for (const field of requiredStrings) {
        if (
            !partial || Object.hasOwn(body, field)
        ) {
            if (
                typeof body[field] !== "string" ||
                !body[field].trim()
            ) {
                return `${field[0].toUpperCase()}${field.slice(1)} is required.`;
            }
        }
    }
    if (
        Object.hasOwn(body, "published") && typeof body.published !== "boolean"
    ) { return "Published must be a boolean."; }
    if (
        Object.hasOwn(body, "sortOrder") && (!Number.isInteger(body.sortOrder) || body.sortOrder < 0)
    ) { return "Sort order must be a non-negative integer."; }
    return null;
};

// PUBLIC: published jobs
router.get(
    "/page",
    handle(async (req, res) => {
        const careers = await Career.find({ published: true })
            .sort({ sortOrder: 1, createdAt: 1 })
            .lean();
        res.set("Cache-Control", "no-store");
        res.json({ careers });
    })
);

// All /admin routes require an authenticated admin
router.use("/admin", requireAdmin);

// ADMIN: all jobs
router.get(
    "/admin",
    handle(async (req, res) => {
        const careers = await Career.find()
        .sort({ sortOrder: 1, createdAt: 1 })
        .lean();
        res.set("Cache-Control", "no-store");
        res.json({ careers });
    })
);

// ADMIN: create job
router.post(
    "/admin",
    handle(async (req, res) => {
        const error = validateCareer(req.body);
        if (error) {
            return res.status(400).json({ message: error });
        }
        const career = await Career.create(pickFields(req.body));
        res.status(201).json({ career });
    })
);

// ADMIN: update job
router.put(
    "/admin/:id",
    handle(async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid career ID.",
            });
        }
        const updates = pickFields(req.body);
        const error = validateCareer(updates, true);
        if (error) {
            return res.status(400).json({ message: error });
        }
        const career = await Career.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );
        if (!career) {
            return res.status(404).json({
                message: "Career not found.",
            });
        }
        res.json({ career });
    })
);

// ADMIN: delete job
router.delete(
    "/admin/:id",
    handle(async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid career ID.",
            });
        }
        const career = await Career.findByIdAndDelete(req.params.id);
        if (!career) {
            return res.status(404).json({
                message: "Career not found.",
            });
        }
        res.json({ success: true });
    })
);

export default router;