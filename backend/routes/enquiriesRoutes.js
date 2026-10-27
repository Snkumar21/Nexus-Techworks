import express from "express";
import nodemailer from "nodemailer";
import Enquiry from "../models/Enquiry.js";
import requireAdmin from "../middleware/requireAdmin.js";
import mongoose from "mongoose";
import Client from "../models/Client.js";

const router = express.Router();

router.use(requireAdmin);

const STATUSES = [
    "New",
    "Contacted",
    "Quotation Sent",
    "Negotiation",
    "Won",
    "Lost",
];

const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[char]);

const getTransporter = () => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error("SMTP configuration is missing.");
    }

    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const sender = () =>  `"Nexus Techworks" <${process.env.SMTP_USER}>`;

// GET /api/enquiries?status=New&search=...
router.get("/", async (req, res) => {
    try {
        const { status, search = "" } = req.query;
        const filter = {};

        if (status && status !== "All") {
            if (!STATUSES.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid enquiry status.",
                });
            }
            filter.status = status;
        }

        const safeSearch = String(search).trim().slice(0, 100);

        if (safeSearch) {
            const escaped = safeSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(escaped, "i");

            filter.$or = [
                { name: regex },
                { email: regex },
                { phone: regex },
                { company: regex },
                { service: regex },
            ];
        }

        const enquiries = await Enquiry.find(filter)
            .select("-emails.body")
            .sort({ createdAt: -1 })
            .limit(500)
            .lean();

        return res.json({
            success: true,
            enquiries,
        });
    } catch (error) {
        console.error("Fetch enquiries error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch enquiries.",
        });
    }
});

// GET /api/enquiries/stats
router.get("/stats", async (req, res) => {
    try {
        const [total, grouped] = await Promise.all([
            Enquiry.countDocuments(),
            Enquiry.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),
        ]);

        const counts = Object.fromEntries(
            grouped.map(({ _id, count }) => [_id, count])
        );

        return res.json({
            success: true,
            total,
            counts: Object.fromEntries(
                STATUSES.map((status) => [status, counts[status] || 0])
            ),
        });
    } catch (error) {
        console.error("Enquiry stats error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch enquiry statistics.",
        });
    }
});

// GET /api/enquiries/:id
router.get("/:id", async (req, res) => {
    try {
        if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid enquiry ID.",
            });
        }

        const enquiry = await Enquiry.findById(req.params.id).lean();

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found.",
            });
        }

        return res.json({ success: true, enquiry });
    } catch (error) {
        console.error("Get enquiry error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch enquiry details.",
        });
    }
});

// PATCH /api/enquiries/:id/status
router.patch("/:id/status", async (req, res) => {
    const session = await mongoose.startSession();

    try {
        if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid enquiry ID.",
            });
        }

        const { status } = req.body;

        if (!STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status.",
            });
        }

        let updatedEnquiry;

        await session.withTransaction(async () => {
            const enquiry = await Enquiry.findById(
                req.params.id
            ).session(session);

            if (!enquiry) {
                const error = new Error("ENQUIRY_NOT_FOUND");
                throw error;
            }

            enquiry.status = status;

            if (status === "Won") {
                let client = enquiry.client
                    ? await Client.findById(enquiry.client).session(session)
                    : null;

                if (!client) {
                    client = await Client.findOne({
                        enquiry: enquiry._id,
                    }).session(session);
                }

                if (!client) {
                    client = new Client({
                        enquiry: enquiry._id,
                        name: enquiry.company?.trim() || enquiry.name,
                        service: enquiry.service,
                        logo: "",
                        website: "",
                        isPublished: false,
                    });

                    await client.save({ session });
                }

                enquiry.client = client._id;
            }

            await enquiry.save({ session });
            updatedEnquiry = enquiry;
        });

        return res.json({
            success: true,
            message: status === "Won"
                ? "Enquiry marked Won. Client is saved as an unpublished draft."
                : "Enquiry status updated.",
            enquiry: updatedEnquiry,
        });
    } catch (error) {
        if (error.message === "ENQUIRY_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found.",
            });
        }

        console.error("Update enquiry status error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update enquiry status.",
        });
    } finally {
        await session.endSession();
    }
});

// POST /api/enquiries/:id/reply
router.post("/:id/reply", async (req, res) => {
    try {
        const { subject, body } = req.body;

        if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid enquiry ID.",
            });
        }

        if (
            typeof subject !== "string" ||
            !subject.trim() ||
            subject.length > 200 ||
            typeof body !== "string" ||
            !body.trim() ||
            body.length > 15000
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid subject and message are required.",
            });
        }

        const enquiry = await Enquiry.findById(req.params.id);

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found.",
            });
        }

        const safeBody = escapeHtml(body.trim()).replace(/\n/g, "<br>");

        await getTransporter().sendMail({
            from: sender(),
            to: enquiry.email,
            replyTo: process.env.SMTP_USER,
            subject: subject.trim(),
            text: body.trim(),
            html: `<div style="font-family:Arial,sans-serif;line-height:1.7">${safeBody}<br><br><strong>Nexus Techworks</strong><br>KEEP EVOLVING.</div>`,
        });

        enquiry.emails.push({
            type: "Reply",
            subject: subject.trim(),
            body: body.trim(),
            sentBy: req.session?.user?.email || "Admin",
        });

        if (enquiry.status === "New") {
            enquiry.status = "Contacted";
        }

        await enquiry.save();

        return res.json({
            success: true,
            message: "Reply email sent successfully.",
            enquiry,
        });
    } catch (error) {
        console.error("Send enquiry reply error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to send reply email.",
        });
    }
});

// POST /api/enquiries/:id/quotation
router.post("/:id/quotation", async (req, res) => {
    try {
        const { amount, currency = "INR", items = [], timeline = "", terms = "" } = req.body;

        if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid enquiry ID.",
            });
        }

        if (
            typeof amount !== "number" ||
            !Number.isFinite(amount) ||
            amount < 0 ||
            amount > 1_000_000_000
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid quotation amount.",
            });
        }

        if (!["INR", "USD", "EUR", "GBP"].includes(currency)) {
            return res.status(400).json({
                success: false,
                message: "Unsupported currency.",
            });
        }

        if (
            !Array.isArray(items) ||
            items.length > 30 ||
            items.some((item) =>
                !item ||
                typeof item.description !== "string" ||
                !item.description.trim() ||
                item.description.length > 250 ||
                typeof item.amount !== "number" ||
                !Number.isFinite(item.amount) ||
                item.amount < 0
            ) ||
            typeof timeline !== "string" ||
            timeline.length > 500 ||
            typeof terms !== "string" ||
            terms.length > 3000
        ) {
            return res.status(400).json({
                success: false,
                message: "Please check the quotation details.",
            });
        }

        const enquiry = await Enquiry.findById(req.params.id);

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found.",
            });
        }

        const formatAmount = (value) =>
            new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency,
                maximumFractionDigits: 2,
            }).format(value);

        const rows = items.length
            ? items.map((item) =>
                `<tr>
                    <td style="padding:10px;border:1px solid #ddd">${escapeHtml(item.description.trim())}</td>
                    <td style="padding:10px;border:1px solid #ddd;text-align:right">${escapeHtml(formatAmount(item.amount))}</td>
                </tr>`
            ).join("")
            : `<tr><td style="padding:10px;border:1px solid #ddd">Project services</td><td style="padding:10px;border:1px solid #ddd;text-align:right">${escapeHtml(formatAmount(amount))}</td></tr>`;

        const html = `
            <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;color:#222;line-height:1.6">
                <h2 style="color:#e31b23">Nexus Techworks</h2>
                <h3>Project Quotation</h3>
                <p>Hello ${escapeHtml(enquiry.name)},</p>
                <p>Thank you for contacting Nexus Techworks. Please find the quotation for your enquiry below.</p>
                <p><strong>Service:</strong> ${escapeHtml(enquiry.service)}</p>
                <table style="border-collapse:collapse;width:100%">
                    <thead><tr>
                        <th style="padding:10px;border:1px solid #ddd;text-align:left">Description</th>
                        <th style="padding:10px;border:1px solid #ddd;text-align:right">Amount</th>
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
                <h3>Total: ${escapeHtml(formatAmount(amount))}</h3>
                <p><strong>Estimated timeline:</strong><br>${escapeHtml(timeline || "To be mutually agreed").replace(/\n/g, "<br>")}</p>
                <p><strong>Terms and conditions:</strong><br>${escapeHtml(terms || "Final scope and delivery schedule will be confirmed before project commencement.").replace(/\n/g, "<br>")}</p>
                <p>Please reply to this email if you have any questions or would like to discuss the quotation.</p>
                <p>Regards,<br><strong>Nexus Techworks</strong><br>KEEP EVOLVING.</p>
            </div>
        `;

        const text = [
            "Nexus Techworks - Project Quotation",
            `Hello ${enquiry.name},`,
            `Service: ${enquiry.service}`,
            "",
            "Quotation items:",
            ...(items.length
                ? items.map((item) => `${item.description}: ${formatAmount(item.amount)}`)
                : [`Project services: ${formatAmount(amount)}`]),
            "",
            `Total: ${formatAmount(amount)}`,
            `Timeline: ${timeline || "To be mutually agreed"}`,
            `Terms: ${terms || "Final scope and delivery schedule will be confirmed before project commencement."}`,
            "",
            "Regards, Nexus Techworks",
            "KEEP EVOLVING.",
        ].join("\n");

        await getTransporter().sendMail({
            from: sender(),
            to: enquiry.email,
            replyTo: process.env.SMTP_USER,
            subject: `Project Quotation - Nexus Techworks`,
            text,
            html,
        });

        enquiry.quotation = {
            amount,
            currency,
            items: items.map((item) => ({
                description: item.description.trim(),
                amount: item.amount,
            })),
            timeline: timeline.trim(),
            terms: terms.trim(),
            sentAt: new Date(),
        };
        enquiry.emails.push({
            type: "Quotation",
            subject: "Project Quotation - Nexus Techworks",
            body: text,
            sentBy: req.session?.user?.email || "Admin",
        });
        enquiry.status = "Quotation Sent";

        await enquiry.save();

        return res.json({
            success: true,
            message: "Quotation sent successfully.",
            enquiry,
        });
    } catch (error) {
        console.error("Send quotation error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to send quotation.",
        });
    }
});

export default router;