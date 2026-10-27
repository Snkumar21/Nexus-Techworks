import express from "express";
import Client from "../models/Client.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

const validId = (id) => /^[a-f\d]{24}$/i.test(id);

const cleanString = (value, maxLength) =>
    typeof value === "string"
        ? value.trim().slice(0, maxLength)
        : "";

const validWebsite = (value) => {
    if (!value) return true;

    try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol);
    } catch {
        return false;
    }
};

const publicFields = "name logo service website";

// PUBLIC: GET /api/clients
// Only published clients; never expose enquiry IDs or private data.
router.get("/", async (req, res) => {
    try {
        const clients = await Client.find({ isPublished: true })
            .select(publicFields)
            .sort({ publishedAt: -1, createdAt: -1 })
            .lean();

        return res.json({ success: true, clients });
    } catch (error) {
        console.error("Fetch public clients error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to load clients.",
        });
    }
});

// Everything below this point requires an authenticated admin.
router.use(requireAdmin);

// GET /api/clients/admin
router.get("/admin", async (req, res) => {
    try {
        const clients = await Client.find()
            .populate("enquiry", "name email company status")
            .sort({ createdAt: -1 })
            .lean();

        return res.json({ success: true, clients });
    } catch (error) {
        console.error("Fetch admin clients error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch clients.",
        });
    }
});

// POST /api/clients/admin — manually create a client
router.post("/admin", async (req, res) => {
    try {
        const name = cleanString(req.body.name, 160);
        const service = cleanString(req.body.service, 160);
        const logo = cleanString(req.body.logo, 2048);
        const website = cleanString(req.body.website, 2048);

        if (!name || !service) {
            return res.status(400).json({
                success: false,
                message: "Client name and service are required.",
            });
        }

        if (!validWebsite(website)) {
            return res.status(400).json({
                success: false,
                message: "Website must be a valid HTTP or HTTPS URL.",
            });
        }

        const client = await Client.create({
            name,
            service,
            logo,
            website,
            isPublished: false,
        });

        return res.status(201).json({
            success: true,
            message: "Client created as draft.",
            client,
        });
    } catch (error) {
        console.error("Create client error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to create client.",
        });
    }
});

// PATCH /api/clients/admin/:id
router.patch("/admin/:id", async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid client ID.",
            });
        }

        const updates = {};

        if (req.body.name !== undefined) {
            updates.name = cleanString(req.body.name, 160);
        }

        if (req.body.service !== undefined) {
            updates.service = cleanString(req.body.service, 160);
        }

        if (req.body.logo !== undefined) {
            updates.logo = cleanString(req.body.logo, 2048);
        }

        if (req.body.website !== undefined) {
            updates.website = cleanString(req.body.website, 2048);
        }

        if (!Object.keys(updates).length) {
            return res.status(400).json({
                success: false,
                message: "No editable fields were supplied.",
            });
        }

        if (
            ("name" in updates && !updates.name) ||
            ("service" in updates && !updates.service)
        ) {
            return res.status(400).json({
                success: false,
                message: "Client name and service cannot be empty.",
            });
        }

        if (
            "website" in updates &&
            !validWebsite(updates.website)
        ) {
            return res.status(400).json({
                success: false,
                message: "Website must be a valid HTTP or HTTPS URL.",
            });
        }

        const client = await Client.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found.",
            });
        }

        return res.json({
            success: true,
            message: "Client updated.",
            client,
        });
    } catch (error) {
        console.error("Update client error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update client.",
        });
    }
});

// PATCH /api/clients/admin/:id/publish
router.patch("/admin/:id/publish", async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid client ID.",
            });
        }

        if (typeof req.body.isPublished !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isPublished must be true or false.",
            });
        }

        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found.",
            });
        }

        client.isPublished = req.body.isPublished;
        client.publishedAt = req.body.isPublished
            ? new Date()
            : null;

        await client.save();

        return res.json({
            success: true,
            message: client.isPublished
                ? "Client published."
                : "Client unpublished.",
            client,
        });
    } catch (error) {
        console.error("Publish client error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to change publication status.",
        });
    }
});

// DELETE /api/clients/admin/:id
router.delete("/admin/:id", async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid client ID.",
            });
        }

        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found.",
            });
        }

        // Preserve the enquiry. Only unlink the client record.
        if (client.enquiry) {
            const Enquiry = (await import("../models/Enquiry.js")).default;
            await Enquiry.updateOne(
                { _id: client.enquiry, client: client._id },
                { $set: { client: null } }
            );
        }

        await client.deleteOne();

        return res.json({
            success: true,
            message: "Client deleted.",
        });
    } catch (error) {
        console.error("Delete client error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete client.",
        });
    }
});

export default router;