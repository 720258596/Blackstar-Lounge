import { Router, Request, Response } from "express";
import passport from "../config/passport";

const router = Router();

// ── STEP 1: Redirect browser to Google ───────────────────────────────────────
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// ── STEP 2: Google redirects back here ───────────────────────────────────────
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL ?? "http://localhost:5173"}?auth=failed`,
    session: true,
  }),
  (_req: Request, res: Response) => {
    // Session is set — send user back to the success screen
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";
    res.redirect(`${frontendUrl}/success`);
  }
);

// ── GET /api/auth/me — return current session user ───────────────────────────
router.get("/me", (req: Request, res: Response) => {
  if (req.isAuthenticated() && req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// ── GET /api/auth/logout ──────────────────────────────────────────────────────
router.get("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";
    res.redirect(frontendUrl);
  });
});

export default router;
