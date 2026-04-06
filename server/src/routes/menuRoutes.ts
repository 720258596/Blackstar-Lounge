import { Router, Request, Response } from "express";
import { prisma } from "../lib/prismaClient";

const router = Router();

// GET /api/menu — all active menu items
router.get("/", async (_req: Request, res: Response) => {
  try {
    const items = await prisma.menuItem.findMany({
      where:   { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    // Map DB field names → frontend field names
    // FIX 2: toLowerCase() on category ensures "Drinks" / "DRINKS" all match
    const mapped = items.map((item) => ({
      id:          item.id,
      name:        item.name,
      description: item.description,
      price:       item.price,
      category:    item.category.toLowerCase().trim(),
      image_url:   item.imageUrl,
      featured:    item.isFeatured,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("GET /api/menu error:", err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

export default router;