import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../middleware/auth.js";
import db from "../database.js";

const router = express.Router();

// POST /api/register
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username?.trim() || !password?.trim())
    return res.status(400).json({ error: "Username and password are required" });
  if (username.trim().length < 3)
    return res.status(400).json({ error: "Username must be at least 3 characters" });
  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters" });

  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username.trim().toLowerCase());
  if (existing) return res.status(409).json({ error: "Username already taken" });

  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username.trim().toLowerCase(), hashed);

  const token = jwt.sign({ id: result.lastInsertRowid, username: username.trim().toLowerCase() }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, username: username.trim().toLowerCase() });
});

// POST /api/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });

  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username.trim().toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: "Invalid username or password" });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, username: user.username });
});

export default router;
