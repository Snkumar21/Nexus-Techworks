import express from "express";
import nodemailer from "nodemailer";
import Enquiry from "../models/Enquiry.js";

const router = express.Router();
const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[char]);

router.post("/", async (req, res) => {
    try {
        const { name, email, phone, company, service, budget, message } = req.body || {};

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
            typeof service !== "string" ||
            !service.trim() ||
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please complete all required fields correctly.",
            });
        }

        const clean = (value, max) => typeof value === "string" ? value.trim().slice(0, max) : "";

        const enquiry = await Enquiry.create({
            name: clean(name, 120),
            email: clean(email, 254).toLowerCase(),
            phone: clean(phone, 30),
            company: clean(company, 160),
            service: clean(service, 160),
            budget: clean(budget, 100),
            message: clean(message, 5000),
        });

        try {
            if (!process.env.SMTP_USER || !process.env.SMTP_PASS) { throw new Error("SMTP configuration is missing."); }

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS, },
            });

            const html = `
                <div style="font-family:Arial,sans-serif;line-height:1.7">
                    <h2>New Website Enquiry</h2>
                    <p><strong>Name:</strong> ${escapeHtml(enquiry.name)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(enquiry.email)}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(enquiry.phone || "Not provided")}</p>
                    <p><strong>Company:</strong> ${escapeHtml(enquiry.company || "Not provided")}</p>
                    <p><strong>Service:</strong> ${escapeHtml(enquiry.service)}</p>
                    <p><strong>Budget:</strong> ${escapeHtml(enquiry.budget || "Not provided")}</p>
                    <p><strong>Message:</strong><br>${escapeHtml(enquiry.message).replace(/\n/g, "<br>")}</p>
                    <p><strong>Enquiry ID:</strong> ${enquiry._id}</p>
                </div>
            `;

            await transporter.sendMail({
                from: `"Nexus Techworks Website" <${process.env.SMTP_USER}>`,
                to: "nexustechworks30@gmail.com",
                replyTo: enquiry.email,
                subject: `New Nexus Techworks Enquiry - ${enquiry.service}`,
                text: [
                    `Name: ${enquiry.name}`,
                    `Email: ${enquiry.email}`,
                    `Phone: ${enquiry.phone || "Not provided"}`,
                    `Company: ${enquiry.company || "Not provided"}`,
                    `Service: ${enquiry.service}`,
                    `Budget: ${enquiry.budget || "Not provided"}`,
                    `Message: ${enquiry.message}`,
                    `Enquiry ID: ${enquiry._id}`,
                ].join("\n"),
                html,
            });
        } catch (emailError) {
            console.error(
                "Enquiry saved, but notification email failed:",
                emailError.message
            );
        }

        return res.status(201).json({
            success: true,
            message: "Enquiry received successfully.",
        });
    } catch (error) {
        console.error("Save contact enquiry error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to save your enquiry. Please try again.",
        });
    }
});

export default router;