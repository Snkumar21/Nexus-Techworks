import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

// IMPORTANT: mount behind a real server-side authentication middleware in production.
// Collection names must match the names in your MongoDB database.
router.get("/stats", async (_req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database not connected" });
    }
    const db = mongoose.connection.db;
    const count = (collection, filter = {}) => db.collection(collection).countDocuments(filter);
    const [services, projects, enquiries, marketplace] = await Promise.all([
      count("services", { isActive: true }),
      count("projects", { isActive: true }),
      count("enquiries", { status: "new" }),
      count("marketplaces", { isActive: true }),
    ]);
    return res.json({ counts: { services, projects, enquiries, marketplace } });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({ message: "Failed to load dashboard stats" });
  }
});
export default router;
