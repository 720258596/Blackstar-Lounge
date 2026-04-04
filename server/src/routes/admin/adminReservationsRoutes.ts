import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prismaClient";
import { adminAuth } from "../../middleware/adminAuth";

const router = Router();

// GET /api/admin/reservations/:eventId — Get reservations for an event
router.get("/:eventId", adminAuth, async (req: Request, res: Response) => {
  try {
    console.log(`[ADMIN RESERVATIONS] Fetching reservations for eventId:`, req.params.eventId);
    
    const reservations = await prisma.reservation.findMany({
      where: { eventId: req.params.eventId as string },
      orderBy: { reservedAt: "desc" },
    });
    
    console.log(`[ADMIN RESERVATIONS] Found ${reservations.length} reservations`);
    res.json(reservations);
  } catch (err) {
    console.error('[ADMIN RESERVATIONS ERROR]', err);
    res.status(500).json({ error: "Failed to fetch reservations", details: err instanceof Error ? err.message : String(err) });
  }
});

// DELETE /api/admin/reservations/:id — Delete a reservation
router.delete("/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    await prisma.reservation.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting reservation:', err);
    res.status(500).json({ error: "Failed to delete reservation", details: String(err) });
  }
});

export default router;
