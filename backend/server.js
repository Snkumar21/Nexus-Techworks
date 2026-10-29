import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

import contactRoute from "./routes/contact.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboard.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import projectsRoutes from "./routes/projectsRoutes.js";
import careersRoutes from "./routes/careersRoutes.js";
import careerApplicationsRoutes from "./routes/careerApplicationsRoutes.js";
import enquiriesRoutes from "./routes/enquiriesRoutes.js";
import clientsRoutes from "./routes/clientsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();
const app = express();
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = [
    "http://localhost:5173",
    "https://nexus-techworks.vercel.app",
    "https://nexustechworks.live",
    "https://www.nexustechworks.live",
];

if (process.env.FRONTEND_URL) { allowedOrigins.push(process.env.FRONTEND_URL); }
if (!process.env.SESSION_SECRET) { throw new Error("SESSION_SECRET is missing."); }
if (isProduction) { app.set("trust proxy", 1); }

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) { return callback(null, true); }
        return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [ "Content-Type", "Authorization", "X-CSRF-Token", ],
    credentials: true,
}));

app.use(express.json({ limit: "1mb" }));

app.use(session({
    name: "nexus.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI, collectionName: "admin_sessions", ttl: 7 * 24 * 60 * 60, }),
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 8 * 60 * 60 * 1000,
        path: "/",
    },
}));

// Protect state-changing admin requests from cross-site submission.
app.use("/api/admin", (req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) { return next(); }
    if (
        req.path === "/login" ||
        req.path === "/logout"
    ) { return next(); }
    next();
});

const protectAdminWrites = (req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) { return next(); }

    const origin = req.get("Origin");
    if (!origin || !allowedOrigins.includes(origin)) { return res.status(403).json({ message: "Request origin not allowed.", }); }

    const expected = req.session?.csrfToken;
    const supplied = req.get("X-CSRF-Token");
    if (!expected || !supplied || supplied !== expected) { return res.status(403).json({ message: "Invalid CSRF token.", }); }
    next();
};

app.get("/", (req, res) => {
    res.json({
        message: "Nexus Techworks API is running.",
        database: mongoose.connection.readyState === 1 ? "connected" : "unavailable",
    });
});

app.use(
    "/api/admin",
    (req, res, next) => {
        if ( req.method === "POST" && req.path === "/login" ) {
            const origin = req.get("Origin");
            if (!origin || !allowedOrigins.includes(origin)) {
                return res.status(403).json({ message: "Request origin not allowed.", });
            }
            return next();
        }
        if (req.method === "POST" && req.path === "/logout") { return protectAdminWrites(req, res, next); }
        next();
    },
    adminAuthRoutes
);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoute);
app.use(
    "/api/enquiries",
    (req, res, next) => {
        if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
            return protectAdminWrites(req, res, next);
        }

        next();
    },
    enquiriesRoutes
);
app.use(
    "/api/clients",
    (req, res, next) => {
        if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
            return protectAdminWrites(req, res, next);
        }

        next();
    },
    clientsRoutes
);
app.use(
    "/api/services",
    (req, res, next) => {
        if (req.path.startsWith("/admin")) { return protectAdminWrites(req, res, next); }
        next();
    },
    servicesRoutes
);
app.use(
    "/api/projects",
    (req, res, next) => {
        if (req.path.startsWith("/admin")) return protectAdminWrites(req, res, next);
        next();
    },
    projectsRoutes
);
app.use(
    "/api/careers",
    (req, res, next) => {
        if (req.path.startsWith("/admin")) { return protectAdminWrites(req, res, next); }
        next();
    },
    careersRoutes
);
app.use(
    "/api/career-applications",
    (req, res, next) => {
        if (req.method !== "GET" && req.method !== "POST") { return protectAdminWrites(req, res, next); }
        next();
    },
    careerApplicationsRoutes
);
app.use(
    "/api/settings",
    (req, res, next) => {
        if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
            return next();
        }
        return protectAdminWrites(req, res, next);
    },
    settingsRoutes
);

app.use((req, res) => { res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}`, }); });
app.use((err, req, res, next) => { console.error("API error:", err); res.status(500).json({ message: "Internal server error", }); });

const PORT = process.env.PORT || 5000;

async function startServer() {
    if (!process.env.MONGODB_URI) { throw new Error("MONGODB_URI is missing."); }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => { console.log( `Nexus Techworks server running on port ${PORT}` ); });
}

startServer().catch((error) => { console.error("Server startup failed:", error); process.exit(1); });