import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prismaClient";
import { adminAuth } from "../../middleware/adminAuth";

const router = Router();

// GET /api/admin/customers
router.get("/", adminAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: { id: true, email: true, name: true, createdAt: true },
      }),
      prisma.user.count(),
    ]);

    res.json({ customers, total, page, pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// GET /api/admin/customers/stats
router.get("/stats", adminAuth, async (_req: Request, res: Response) => {
  try {
    const total = await prisma.user.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await prisma.user.count({ where: { createdAt: { gte: today } } });
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekCount = await prisma.user.count({ where: { createdAt: { gte: weekAgo } } });

    res.json({ total, today: todayCount, thisWeek: weekCount });
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
