import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

const app = express();
app.use(cors());
app.use(express.json());
import complaintsRoute from "./routes/complaints.js";
let complaints = [];
// Create complaint
app.post("/api/complaints", (req, res) => {
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

  complaints.push(complaint);

  res.json(complaint);
});

// Get complaints
app.get("/api/complaints", (req, res) => {
  res.json(complaints);
});

// rate limit memory
const rateLimit = {};

const checkRate = (ip) => {
  const now = Date.now();
  if (rateLimit[ip] && now - rateLimit[ip] < 30000) return false;
  rateLimit[ip] = now;
  return true;
};

// Create complaint
app.post("/api/complaints", (req, res) => {
  const { title, description, category, location } = req.body;

  if (!title || !description || !category || !location) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (title.length > 100 || description.length > 1000) {
    return res.status(400).json({ error: "Input too long" });
  }

  const complaint = {
    id: randomUUID(),
    title,
    description,
    category,
    location,
    status: "Submitted",
    createdAt: new Date(),
  };

  complaints.push(complaint);

  res.json(complaint);
});

// Admin update status
app.patch("/api/admin/complaints/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const comp = complaints.find((c) => c.id === id);
  if (!comp) {
    return res.status(404).json({ error: "Not found" });
  }

  comp.status = status || comp.status;
  res.json(comp);
});

app.post("/api/logout", (_, res) => {
  res.json({ message: "Logged out" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
