import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prismaClient";
import { adminAuth } from "../../middleware/adminAuth";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Simple file storage for development
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const name = `menu_${Date.now()}_${file.originalname}`;
    cb(null, name);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/admin/menu/upload-image — Local file upload
router.post("/upload-image", adminAuth, upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:3000';
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, fileId: req.file.filename });
  } catch (err) {
    res.status(500).json({ error: "Image upload failed" });
  }
});

// GET /api/admin/menu/imagekit-auth — Mock auth for client-side upload
router.get("/imagekit-auth", adminAuth, (_req: Request, res: Response) => {
  try {
    // Return mock auth params - client will use local upload instead
    res.json({
      token: "mock_token",
      expire: Math.floor(Date.now() / 1000) + 3600,
      signature: "mock_signature",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get auth" });
  }
});

// GET /api/admin/menu — all items (including inactive)
router.get("/", adminAuth, async (_req: Request, res: Response) => {
  try {
    const items = await prisma.menuItem.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// POST /api/admin/menu — create
router.post("/", adminAuth, async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, imageUrl, isFeatured, isActive } = req.body;
    const item = await prisma.menuItem.create({
      data: { name, description, price, category, imageUrl, isFeatured: isFeatured ?? false, isActive: isActive ?? true },
    });
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

// PUT /api/admin/menu/:id — update
router.put("/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, imageUrl, isFeatured, isActive } = req.body;
    const item = await prisma.menuItem.update({
      where: { id: req.params.id as string },
      data: { name, description, price, category, imageUrl, isFeatured, isActive },
    });
    res.json(item);
  } catch {
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// DELETE /api/admin/menu/:id — delete
router.delete("/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    await prisma.menuItem.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

export default router;
