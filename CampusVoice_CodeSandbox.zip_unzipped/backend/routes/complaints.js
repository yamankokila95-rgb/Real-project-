import express from "express";
import { randomUUID } from "crypto";

const router = express.Router();

router.post("/complaints", (req, res) => {
  const { title, description, category, location } = req.body;

  if (!title || !description || !category || !location) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const complaint = {
    id: randomUUID(),
    title,
    description,
    category,
    location,
    status: "pending",
    createdAt: new Date(),
  };

  res.json({
    complaintId: complaint.id,
  });
});

export default router;
