import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prismaClient";
import { adminAuth } from "../../middleware/adminAuth";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// ─── FILE UPLOAD SETUP ───────────────────────────────────────────────────────

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    // Sanitize original filename to avoid spaces/special chars in URL
    const sanitized = file.originalname.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
    const name = `event_${Date.now()}_${sanitized}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

// ─── ROUTES ──────────────────────────────────────────────────────────────────

// GET /api/admin/events
router.get("/", adminAuth, async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
    res.json(events);
  } catch (err) {
    console.error("GET /api/admin/events error:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// POST /api/admin/events
router.post("/", adminAuth, async (req: Request, res: Response) => {
  try {
    const { title, description, date, posterUrl, isActive } = req.body;

    if (!title?.trim()) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const event = await prisma.event.create({
      data: {
        title:       title.trim(),
        description: description ?? null,
        date:        date ? new Date(date) : null,
        posterUrl:   posterUrl ?? null,
        isActive:    isActive ?? true,
      },
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("POST /api/admin/events error:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// PUT /api/admin/events/:id
router.put("/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    const { title, description, date, posterUrl, isActive } = req.body;

    if (!title?.trim()) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const event = await prisma.event.update({
      where: { id: req.params.id as string },
      data: {
        title:       title.trim(),
        description: description ?? null,
        date:        date ? new Date(date) : null,
        posterUrl:   posterUrl ?? null,
        isActive,
      },
    });

    res.json(event);
  } catch (err) {
    console.error("PUT /api/admin/events/:id error:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// DELETE /api/admin/events/:id
router.delete("/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    // Also delete the poster file from disk if it's a local upload
    const event = await prisma.event.findUnique({ where: { id: req.params.id as string } });
    if (event?.posterUrl) {
      const filename = path.basename(event.posterUrl);
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.event.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/events/:id error:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// PATCH /api/admin/events/:id/toggle
router.patch("/:id/toggle", adminAuth, async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id as string } });
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const updated = await prisma.event.update({
      where: { id: req.params.id as string },
      data:  { isActive: !event.isActive },
    });

    res.json(updated);
  } catch (err) {
    console.error("PATCH /api/admin/events/:id/toggle error:", err);
    res.status(500).json({ error: "Failed to toggle event" });
  }
});

// POST /api/admin/events/upload-poster
// NOTE: This route must be defined BEFORE /:id routes to avoid Express
// matching "upload-poster" as an :id param.
router.post(
  "/upload-poster",
  adminAuth,
  upload.single("poster"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }

      // ✅ Use SERVER_BASE_URL env var so this works correctly behind proxies
      // and in production. Add SERVER_BASE_URL=http://localhost:3000 to your .env
      const BASE_URL =
        process.env.SERVER_BASE_URL ||
        `${req.protocol}://${req.get("host")}`;

      const fileUrl = `${BASE_URL}/uploads/${req.file.filename}`;

      res.json({ url: fileUrl, fileId: req.file.filename });
    } catch (err) {
      console.error("POST /api/admin/events/upload-poster error:", err);
      res.status(500).json({ error: "Poster upload failed" });
    }
  }
);

export default router;