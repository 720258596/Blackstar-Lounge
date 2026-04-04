import { Router, Request, Response } from "express";
import { prisma } from "../lib/prismaClient";

const router = Router();

// GET /api/reservations/:eventId — Get reservations for an event
router.get("/:eventId", async (req: Request, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { eventId: req.params.eventId as string },
      orderBy: { reservedAt: "desc" },
    });
    res.json(reservations);
  } catch {
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

// POST /api/reservations — Create a reservation
router.post("/", async (req: Request, res: Response) => {
  try {
    const { eventId, guestName, guestEmail, guestPhone, partySize } = req.body;
    
    if (!eventId || !guestName || !guestEmail || !guestPhone || !partySize) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const reservation = await prisma.reservation.create({
      data: {
        eventId,
        guestName,
        guestEmail,
        guestPhone,
        partySize: parseInt(partySize),
      },
    });
    
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

export default router;
