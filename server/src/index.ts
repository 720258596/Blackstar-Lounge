import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport";
import path from "path";

// Public routes
import authRoutes from "./routes/auth.routes";
import menuRoutes from "./routes/menuRoutes";
import eventsRoutes from "./routes/eventsRoutes";
import promotionsRoutes from "./routes/promotionsRoutes";
import reservationsRoutes from "./routes/reservationsRoutes";

// Admin routes
import adminAuthRoutes from "./routes/admin/adminAuthRoutes";
import adminMenuRoutes from "./routes/admin/adminMenuRoutes";
import adminEventsRoutes from "./routes/admin/adminEventsRoutes";
import adminPromotionsRoutes from "./routes/admin/adminPromotionsRoutes";
import adminCustomersRoutes from "./routes/admin/adminCustomersRoutes";
import adminReservationsRoutes from "./routes/admin/adminReservationsRoutes";

const app = express();

const ALLOWED_ORIGINS = [
  "http://localhost:5173", // client
  "http://localhost:5174", // admin
  "http://blackstar-lounge.varcel.app", // client
  "http://blackstar-lounge-admin.varcel.app", // admin

  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "blackstar_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ── Static files ───────────────────────────────────────────
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// ── Public API routes ──────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/promotions", promotionsRoutes);
app.use("/api/reservations", reservationsRoutes);

// ── Admin API routes ───────────────────────────────────────────
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/menu", adminMenuRoutes);
app.use("/api/admin/events", adminEventsRoutes);
app.use("/api/admin/promotions", adminPromotionsRoutes);
app.use("/api/admin/customers", adminCustomersRoutes);
app.use("/api/admin/reservations", adminReservationsRoutes);

// ── Health check ───────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Black Star API Running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
