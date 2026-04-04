import { Router, Request, Response } from "express";
import { prisma } from "../lib/prismaClient";

const router = Router();

// GET /api/promotions/active  — only active promotions
router.get("/active", async (_req: Request, res: Response) => {
  try {
    const promotions = await prisma.promotion.findMany({
      where: { isActive: true },
    });

    res.json(promotions);
  } catch (err) {
    console.error("GET /api/promotions/active error:", err);
    res.status(500).json({ error: "Failed to fetch promotions" });
  }
});

export default router;
