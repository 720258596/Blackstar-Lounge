import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { adminAuth, AdminRequest } from "../../middleware/adminAuth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "blackstar_admin_secret";

// Hash is generated at startup from env vars
let ADMIN_HASH: string | null = null;

async function getAdminHash(): Promise<string> {
  if (ADMIN_HASH) return ADMIN_HASH;
  const pass = process.env.ADMIN_PASSWORD || "Kelly123";
  ADMIN_HASH = await bcrypt.hash(pass, 12);
  return ADMIN_HASH;
}

// POST /api/admin/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL || "klisandru@gmail.com";
    if (email !== adminEmail) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const adminPass = process.env.ADMIN_PASSWORD || "Kelly123";
    const valid = password === adminPass || await bcrypt.compare(password, await getAdminHash());

    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, email });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/admin/verify
router.get("/verify", adminAuth, (req: AdminRequest, res: Response) => {
  res.json({ email: req.admin?.email, valid: true });
});

export default router;
