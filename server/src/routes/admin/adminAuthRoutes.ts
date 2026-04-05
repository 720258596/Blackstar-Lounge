import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { adminAuth, AdminRequest } from "../../middleware/adminAuth";

const router = Router();

// POST /api/admin/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const adminEmail    = process.env.ADMIN_EMAIL    ?? "klisandru@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD ?? "Kelly123";
    const jwtSecret     = process.env.JWT_SECRET     ?? "blackstar_admin_secret";

    // Check email
    if (email !== adminEmail) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Support both plaintext and bcrypt hash in ADMIN_PASSWORD
    const isHash    = adminPassword.startsWith("$2")
    const valid     = isHash
      ? await bcrypt.compare(password, adminPassword)
      : password === adminPassword

    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ email }, jwtSecret, { expiresIn: "24h" });
    res.json({ token, email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/admin/verify
router.get("/verify", adminAuth, (req: AdminRequest, res: Response) => {
  res.json({ email: req.admin?.email, valid: true });
});

export default router;