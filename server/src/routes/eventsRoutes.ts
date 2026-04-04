import { Router, Request, Response } from "express";
import { prisma } from "../lib/prismaClient";

const router = Router();

// GET /api/events/active  — only active events, sorted soonest first
router.get("/active", async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where:   { isActive: true },
      orderBy: { date: "asc" },
    });

    // Format date → readable string for the frontend cards
    const mapped = events.map((event) => ({
      id:          event.id,
      title:       event.title,
      description: event.description,
      posterUrl:   event.posterUrl ?? null,
      date: event.date
        ? event.date.toLocaleDateString("en-KE", {
            weekday: "long",
            month:   "short",
            day:     "numeric",
          })
        : null,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("GET /api/events/active error:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;
