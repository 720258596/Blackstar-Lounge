import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prismaClient";
import { adminAuth } from "../../middleware/adminAuth";

const router = Router();

// GET /api/admin/promotions
router.get("/", adminAuth, async (_req: Request, res: Response) => {
  try {
    const promos = await prisma.promotion.findMany({ orderBy: { title: "asc" } });
    res.json(promos);
  } catch {
    res.status(500).json({ error: "Failed to fetch promotions" });
  }
});

// POST /api/admin/promotions
router.post("/", adminAuth, async (req: Request, res: Response) => {
  try {
    const { title, detail, isActive } = req.body;
    const promo = await prisma.promotion.create({
      data: { title, detail, isActive: isActive ?? true },
    });
    res.status(201).json(promo);
  } catch {
    res.status(500).json({ error: "Failed to create promotion" });
  }
});

// PUT /api/admin/promotions/:id
router.put("/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    const { title, detail, isActive } = req.body;
    const promo = await prisma.promotion.update({
      where: { id: req.params.id as string },
      data: { title, detail, isActive },
    });
    res.json(promo);
  } catch {
    res.status(500).json({ error: "Failed to update promotion" });
  }
});

// DELETE /api/admin/promotions/:id
router.delete("/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    await prisma.promotion.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete promotion" });
  }
});

// PATCH /api/admin/promotions/:id/toggle
router.patch("/:id/toggle", adminAuth, async (req: Request, res: Response) => {
  try {
    const promo = await prisma.promotion.findUnique({ where: { id: req.params.id as string } });
    if (!promo) { res.status(404).json({ error: "Promotion not found" }); return; }
    const updated = await prisma.promotion.update({
      where: { id: req.params.id as string },
      data: { isActive: !promo.isActive },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to toggle promotion" });
  }
});

export default router;
