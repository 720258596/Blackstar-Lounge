import { Router, Request, Response } from "express";
import { prisma } from "../lib/prismaClient";

const router = Router();

// GET /api/menu  — all menu items
router.get("/", async (_req: Request, res: Response) => {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Map DB field names → frontend field names
    const mapped = items.map((item) => ({
      id:          item.id,
      name:        item.name,
      description: item.description,
      price:       item.price,
      category:    item.category,
      image_url:   item.imageUrl,   // camelCase → snake_case for frontend
      featured:    item.isFeatured,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("GET /api/menu error:", err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

export default router;
