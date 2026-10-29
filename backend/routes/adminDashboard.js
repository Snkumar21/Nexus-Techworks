import { Router } from "express";
import mongoose from "mongoose";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

// All dashboard statistics require an authenticated admin.
router.use(requireAdmin);

router.get("/stats", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: "Database not connected",
            });
        }

        const db = mongoose.connection.db;

        const [ services, projects, enquiries, marketplace, ] = 
          await Promise.all([
            db.collection("services").countDocuments({
                published: true,
            }),

            db.collection("projects").countDocuments({
                published: true,
            }),

            db.collection("enquiries").countDocuments({
                status: "New",
            }),

            db.collection("marketplaces").countDocuments({
                isActive: true,
            }),
        ]);

        res.set("Cache-Control", "no-store");

        return res.json({
            success: true,
            counts: {
                services,
                projects,
                enquiries,
                marketplace,
            },
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard stats",
        });
    }
});

export default router;