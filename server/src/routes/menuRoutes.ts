import { Router, Request, Response } from "express";
import { prisma } from "../lib/prismaClient";

const router = Router();

// Valid categories — frontend tabs must match exactly
const VALID_CATEGORIES = [
  'whiskey', 'gin', 'cognac', 'vodka', 'tequila',
  'rum', 'champagne', 'cocktails', 'shooters', 'food',
  // legacy support — old items saved as 'drinks' still show
  'drinks',
];

// GET /api/menu — all active menu items
router.get("/", async (_req: Request, res: Response) => {
  try {
    const items = await prisma.menuItem.findMany({
      where:   { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    const mapped = items.map((item) => ({
      id:          item.id,
      name:        item.name,
      description: item.description,
      price:       item.price,
      // Normalise — lowercase + trim, ensures admin input is always clean
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
