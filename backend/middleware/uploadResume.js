import multer from "multer";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { RESUME_DIR, ensureResumeDirectory, } from "../utils/privateResumeStorage.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const storage = multer.diskStorage({
  destination(req, file, callback) {
    ensureResumeDirectory()
      .then(() => callback(null, RESUME_DIR))
      .catch(callback);
  },

  filename(req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
    fields: 20,
    fieldSize: 10 * 1024,
  },
  fileFilter(req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    const expectedMime = allowedTypes[extension];

    if (!expectedMime || file.mimetype !== expectedMime) {
      const error = new Error("Upload a valid PDF, DOC, or DOCX resume.");
      error.status = 400;
      return callback(error);
    }

    callback(null, true);
  },
});

export function uploadResume(req, res, next) {
  upload.single("resume")(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Resume must be 5 MB or smaller."
          : "Resume upload failed. Upload one file of up to 5 MB.";

      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Resume upload failed.",
    });
  });
}