import express from "express";
import { requireAuth } from "../middleware/auth.js";
import db from "../database.js";

const router = express.Router();

// All routes require auth
router.use(requireAuth);

// POST /api/checkins — submit today's check-in
router.post("/checkins", (req, res) => {
  const { mood, stressLevel, hoursSlept, studyHours, notes } = req.body;
  if (!mood || !stressLevel || hoursSlept == null || studyHours == null)
    return res.status(400).json({ error: "Missing required fields" });

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    db.prepare(`
      INSERT INTO checkins (userId, mood, stressLevel, hoursSlept, studyHours, notes, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, mood, stressLevel, hoursSlept, studyHours, notes || "", today);

    res.json({ message: "Check-in saved" });
  } catch (err) {
    // UNIQUE constraint on (userId, date) — already checked in today
    if (err.message.includes("UNIQUE")) return res.status(409).json({ error: "Already checked in today" });
    res.status(500).json({ error: err.message });
  }
});

// GET /api/checkins/today — did user check in today?
router.get("/checkins/today", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const row = db.prepare("SELECT * FROM checkins WHERE userId = ? AND date = ?").get(req.user.id, today);
  res.json({ checkedIn: !!row, entry: row || null });
});

// GET /api/checkins — last 30 days of check-ins for analytics
router.get("/checkins", (req, res) => {
  const rows = db.prepare(`
    SELECT * FROM checkins WHERE userId = ?
    ORDER BY date DESC LIMIT 30
  `).all(req.user.id);
  res.json(rows);
});

// GET /api/profile — user stats
router.get("/profile", (req, res) => {
  const user = db.prepare("SELECT id, username, createdAt FROM users WHERE id = ?").get(req.user.id);
  const totalCheckIns = db.prepare("SELECT COUNT(*) as count FROM checkins WHERE userId = ?").get(req.user.id).count;

  // Calculate current streak
  const entries = db.prepare("SELECT date FROM checkins WHERE userId = ? ORDER BY date DESC").all(req.user.id);
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < entries.length; i++) {
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);
    const expectedStr = expected.toISOString().split("T")[0];
    if (entries[i].date === expectedStr) streak++;
    else break;
  }

  // Average mood this week
  const moodScore = { happy: 5, good: 4, neutral: 3, sad: 2, stressed: 1 };
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const weekEntries = db.prepare("SELECT mood FROM checkins WHERE userId = ? AND date >= ?")
    .all(req.user.id, weekAgo.toISOString().split("T")[0]);
  const avgScore = weekEntries.length
    ? weekEntries.reduce((sum, e) => sum + (moodScore[e.mood] || 3), 0) / weekEntries.length
    : null;

  res.json({ username: user.username, createdAt: user.createdAt, totalCheckIns, streak, avgMoodScore: avgScore });
});

export default router;
