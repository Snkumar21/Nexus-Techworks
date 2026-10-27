import { Router } from "express";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();
const handle = (fn) => (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next); };
const projectFields = [ "title", "category", "description", "tech", "status", "featured", "link", "previewImage", "published", "sortOrder", ];

const selectFields = (body, fields) =>
  Object.fromEntries(
    fields
      .filter((key) => Object.prototype.hasOwnProperty.call(body, key))
      .map((key) => [key, body[key]])
  );

const validateProject = (body) => {
  for (const field of ["title", "category", "description", "status"]) {
    if (typeof body[field] !== "string" || !body[field].trim()) {
      return `${field[0].toUpperCase()}${field.slice(1)} is required.`;
    }
  }

  if (
    !Array.isArray(body.tech) ||
    body.tech.length > 20 ||
    body.tech.some((item) => typeof item !== "string" || !item.trim())
  ) {
    return "Technologies must be a list of up to 20 non-empty strings.";
  }

  if (typeof body.featured !== "boolean" || typeof body.published !== "boolean") {
    return "Featured and published must be boolean values.";
  }

  if (!Number.isInteger(body.sortOrder) || body.sortOrder < 0) {
    return "Sort order must be a non-negative integer.";
  }

  if (typeof body.link !== "string") {
    return "Project link must be a string.";
  }

  const link = body.link.trim();
  if (link && !/^https?:\/\//i.test(link)) {
    return "Project link must start with http:// or https://.";
  }

  if (
    body.previewImage !== undefined && body.previewImage !== ""
  ) {
    if (typeof body.previewImage !== "string") {
      return res.status(400).json({ message: "Preview image URL must be a string.", });
    }

    try {
      const imageUrl = new URL(body.previewImage);

      if (
        imageUrl.protocol !== "https:" || imageUrl.hostname !== "res.cloudinary.com"
      ) {
        return res.status(400).json({ message: "Preview image must be a valid Cloudinary HTTPS URL.", });
      }
    } catch {
      return res.status(400).json({ message: "Please provide a valid preview image URL.", });
    }
  }

  return null;
};

/* PUBLIC API: published projects only */
router.get(
  "/page",
  handle(async (req, res) => {
    const projects = await Project.find({ published: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    res.set("Cache-Control", "no-store");
    res.json({ projects });
  })
);

/* All routes below this point require an authenticated admin session. */
router.use("/admin", requireAdmin);

router.get(
  "/admin",
  handle(async (req, res) => {
    const projects = await Project.find()
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    res.set("Cache-Control", "no-store");
    res.json({ projects });
  })
);

router.post(
  "/admin",
  handle(async (req, res) => {
    const error = validateProject(req.body);
    if (error) return res.status(400).json({ message: error });

    const project = await Project.create(selectFields(req.body, projectFields));
    res.status(201).json({ project });
  })
);

router.put(
  "/admin/:id",
  handle(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID." });
    }

    const error = validateProject(req.body);
    if (error) return res.status(400).json({ message: error });

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: selectFields(req.body, projectFields) },
      { new: true, runValidators: true }
    );

    if (!project) return res.status(404).json({ message: "Project not found." });
    res.json({ project });
  })
);

router.delete(
  "/admin/:id",
  handle(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID." });
    }

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });
    res.json({ success: true });
  })
);

export default router;