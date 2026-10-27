import { Router } from "express";
import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "node:path";

import CareerApplication from "../models/CareerApplication.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { uploadResume } from "../middleware/uploadResume.js";
import {
  RESUME_DIR,
  deleteResumeFile,
} from "../utils/privateResumeStorage.js";

const router = Router();

const handle = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const isOptionalUrl = (value) => {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

async function validateResumeSignature(file) {
  const fileHandle = await fs.open(file.path, "r");

  try {
    const buffer = Buffer.alloc(8);
    const { bytesRead } = await fileHandle.read(buffer, 0, 8, 0);
    const header = buffer.subarray(0, bytesRead);
    const extension = path.extname(file.originalname).toLowerCase();

    if (extension === ".pdf") {
      return header.subarray(0, 5).toString() === "%PDF-";
    }

    if (extension === ".doc") {
      return header.equals(
        Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
      );
    }

    if (extension === ".docx") {
      return (
        header.length >= 4 &&
        header[0] === 0x50 &&
        header[1] === 0x4b &&
        [0x03, 0x05, 0x07].includes(header[2]) &&
        [0x04, 0x06, 0x08].includes(header[3])
      );
    }

    return false;
  } finally {
    await fileHandle.close();
  }
}

// PUBLIC: Submit an application with a required resume.
router.post(
  "/",
  uploadResume,
  handle(async (req, res) => {
    const uploadedFile = req.file;
    let saved = false;

    try {
      const {
        name,
        email,
        phone = "",
        position,
        experience = "",
        portfolio = "",
        github = "",
        linkedin = "",
      } = req.body || {};

      if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof email !== "string" ||
        !email.trim() ||
        typeof position !== "string" ||
        !position.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Name, email and position are required.",
        });
      }

      if (!uploadedFile) {
        return res.status(400).json({
          success: false,
          message: "Please upload your resume.",
        });
      }

      if (!(await validateResumeSignature(uploadedFile))) {
        return res.status(400).json({
          success: false,
          message: "The uploaded file is not a valid supported resume.",
        });
      }

      const cleanEmail = email.trim();

      if (
        cleanEmail.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address.",
        });
      }

      const optionalStrings = {
        phone,
        experience,
        portfolio,
        github,
        linkedin,
      };

      for (const [field, value] of Object.entries(optionalStrings)) {
        if (typeof value !== "string") {
          return res.status(400).json({
            success: false,
            message: `${field} must be a string.`,
          });
        }
      }

      if (
        name.trim().length > 120 ||
        position.trim().length > 160 ||
        phone.length > 30 ||
        experience.length > 50
      ) {
        return res.status(400).json({
          success: false,
          message: "One or more fields exceed the allowed length.",
        });
      }

      for (const [field, value] of Object.entries({
        portfolio,
        github,
        linkedin,
      })) {
        if (value.length > 500 || !isOptionalUrl(value.trim())) {
          return res.status(400).json({
            success: false,
            message: `Please provide a valid ${field} URL.`,
          });
        }
      }

      const safeOriginalName = path
        .basename(uploadedFile.originalname)
        .replace(/[\u0000-\u001f\u007f]/g, "")
        .slice(0, 255);

      const application = await CareerApplication.create({
        name: name.trim(),
        email: cleanEmail.toLowerCase(),
        phone: phone.trim(),
        position: position.trim(),
        experience: experience.trim(),
        portfolio: portfolio.trim(),
        github: github.trim(),
        linkedin: linkedin.trim(),
        resume: {
          storageKey: path.basename(uploadedFile.filename),
          originalName: safeOriginalName || "resume",
          mimeType: uploadedFile.mimetype,
          size: uploadedFile.size,
        },
      });

      // Keep the uploaded file only after the database save succeeds.
      saved = true;

      return res.status(201).json({
        success: true,
        message: "Application submitted successfully.",
        applicationId: application._id,
      });
    } finally {
      // Delete the uploaded file if validation or database saving fails.
      if (uploadedFile && !saved) {
        await deleteResumeFile(path.basename(uploadedFile.filename));
      }
    }
  })
);

// All routes below this point require admin authentication.
router.use(requireAdmin);

// ADMIN: List applications without exposing the private storage key.
router.get(
  "/",
  handle(async (req, res) => {
    const applications = await CareerApplication.find()
      .sort({ createdAt: -1 })
      .lean();

    res.set("Cache-Control", "no-store");
    return res.json({ applications });
  })
);

// ADMIN: Download a resume through an authenticated endpoint.
router.get(
  "/:id/resume",
  handle(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid application ID.",
      });
    }

    const application = await CareerApplication.findById(req.params.id)
      .select("+resume.storageKey")
      .lean();

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    const resume = application.resume;

    if (
      !resume?.storageKey ||
      path.basename(resume.storageKey) !== resume.storageKey
    ) {
      return res.status(404).json({
        message: "Resume not found.",
      });
    }

    const filePath = path.join(RESUME_DIR, resume.storageKey);

    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        message: "Resume file not found.",
      });
    }

    const allowedMimeTypes = new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]);

    const mimeType = allowedMimeTypes.has(resume.mimeType)
      ? resume.mimeType
      : "application/octet-stream";

    const safeName = (resume.originalName || "resume")
      .replace(/["\\\r\n]/g, "_")
      .slice(0, 255);

    res.set({
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Type": mimeType,
      "Content-Disposition": `${
        mimeType === "application/pdf" ? "inline" : "attachment"
      }; filename="${safeName}"`,
    });

    return res.sendFile(filePath);
  })
);

// ADMIN: Update application status.
router.patch(
  "/:id/status",
  handle(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid application ID.",
      });
    }

    const allowedStatuses = [
      "New",
      "Reviewing",
      "Shortlisted",
      "Rejected",
      "Hired",
    ];

    const { status } = req.body || {};

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status.",
      });
    }

    const application = await CareerApplication.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    return res.json({ application });
  })
);

// ADMIN: Delete an application and its private resume.
router.delete(
  "/:id",
  handle(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    const application = await CareerApplication.findById(
      req.params.id
    ).select("+resume.storageKey");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const storageKey = application.resume?.storageKey;

    // Refuse unsafe paths rather than deleting arbitrary files.
    if (
      storageKey &&
      path.basename(storageKey) !== storageKey
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume storage key.",
      });
    }

    // Delete the private file first. If this fails, retain the DB record.
    if (storageKey) {
      await deleteResumeFile(storageKey);
    }

    await CareerApplication.deleteOne({
      _id: application._id,
    });

    return res.json({
      success: true,
      message: "Application and stored resume deleted successfully.",
    });
  })
);

export default router;