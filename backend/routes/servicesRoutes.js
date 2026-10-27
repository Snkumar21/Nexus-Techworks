import { Router } from "express";
import mongoose from "mongoose";
import Service from "../models/Service.js";
import ServicesPage from "../models/ServicesPage.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();
const handle = (fn) => (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next); };
const serviceFields = [ "title", "description", "price", "priceType", "published", "sortOrder", ];
const pageFields = [
  "heroLabel", "heroTitle",
  "heroAccent", "heroDescription",
  "pricingLabel", "pricingTitle",
  "pricingAccent", "pricingDescription",
  "pricingNote", "serviceButtonText",
  "serviceLink", "processLabel",
  "processTitle", "processAccent",
  "processDescription", "ctaLabel",
  "ctaTitle", "ctaAccent",
  "ctaDescription", "ctaButtonText",
  "ctaLink", "processSteps",
];

const selectFields = (body, fields) =>
  Object.fromEntries(
    fields
      .filter((key) =>
        Object.prototype.hasOwnProperty.call(body, key)
      )
      .map((key) => [key, body[key]])
  );

const validateService = (body) => {
  if (
    typeof body.title !== "string" ||
    !body.title.trim()
  ) {
    return "Service title is required";
  }

  if (
    typeof body.description !== "string" ||
    !body.description.trim()
  ) {
    return "Description is required";
  }

  if (
    typeof body.price !== "number" ||
    !Number.isFinite(body.price) ||
    body.price < 0
  ) {
    return "Valid USD price is required";
  }

  if (!["starting", "monthly"].includes(body.priceType)) {
    return "Invalid price type";
  }

  if (typeof body.published !== "boolean") {
    return "Published must be boolean";
  }

  if (!Number.isInteger(body.sortOrder)) {
    return "Sort order must be an integer";
  }

  return null;
};

const safeLink = (value) =>
  typeof value === "string" &&
  /^\/(?!\/)[^\s\\]*$/.test(value);

const validatePage = (body) => {
  const textFields = pageFields.filter(
    (key) =>
      !["serviceLink", "ctaLink", "processSteps"].includes(key)
  );

  if (
    textFields.some(
      (key) => typeof body[key] !== "string"
    )
  ) {
    return "All page text fields must be strings";
  }

  if (
    !safeLink(body.serviceLink) ||
    !safeLink(body.ctaLink)
  ) {
    return "Links must be valid internal paths";
  }

  if (
    !Array.isArray(body.processSteps) ||
    body.processSteps.length > 12 ||
    body.processSteps.some(
      (step) =>
        !step ||
        typeof step.title !== "string" ||
        typeof step.description !== "string"
    )
  ) {
    return "Invalid process steps";
  }

  return null;
};

/* =========================
   PUBLIC API
========================= */

router.get(
  "/page",
  handle(async (req, res) => {
    const [page, services] = await Promise.all([
      ServicesPage.findOne({ key: "services" }).lean(),

      Service.find({ published: true })
        .sort({ sortOrder: 1, createdAt: 1 })
        .lean(),
    ]);

    res.set("Cache-Control", "no-store");

    res.json({
      page,
      services,
    });
  })
);

/* =========================
   PROTECTED ADMIN API
========================= */

router.use("/admin", requireAdmin);

router.get(
  "/admin",
  handle(async (req, res) => {
    const [page, services] = await Promise.all([
      ServicesPage.findOne({ key: "services" }).lean(),

      Service.find()
        .sort({ sortOrder: 1, createdAt: 1 })
        .lean(),
    ]);

    res.set("Cache-Control", "no-store");

    res.json({
      page,
      services,
    });
  })
);

/* CREATE / UPDATE PAGE CONTENT */

router.put(
  "/admin/page",
  handle(async (req, res) => {
    const error = validatePage(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const payload = selectFields(req.body, pageFields);

    const page = await ServicesPage.findOneAndUpdate(
      { key: "services" },
      {
        $set: payload,
        $setOnInsert: { key: "services" },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.json({ page });
  })
);

/* CREATE SERVICE */

router.post(
  "/admin",
  handle(async (req, res) => {
    const error = validateService(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const service = await Service.create(
      selectFields(req.body, serviceFields)
    );

    res.status(201).json({ service });
  })
);

/* UPDATE SERVICE */

router.put(
  "/admin/:id",
  handle(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid service ID",
      });
    }

    const error = validateService(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        $set: selectFields(req.body, serviceFields),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.json({ service });
  })
);

/* DELETE SERVICE */

router.delete(
  "/admin/:id",
  handle(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid service ID",
      });
    }

    const service = await Service.findByIdAndDelete(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.json({ success: true });
  })
);

export default router;