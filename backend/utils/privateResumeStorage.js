import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export const RESUME_DIR = path.resolve(
    process.env.PRIVATE_RESUME_DIR || path.join(currentDir, "../private-resumes")
);

export async function ensureResumeDirectory() {
    await fs.mkdir(RESUME_DIR, {
        recursive: true,
        mode: 0o700,
    });
}

export async function deleteResumeFile(filename) {
    if (!filename || path.basename(filename) !== filename) return;

    try {
        await fs.unlink(path.join(RESUME_DIR, filename));
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }
}