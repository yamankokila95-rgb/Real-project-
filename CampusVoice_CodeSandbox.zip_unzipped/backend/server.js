import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
const db = require("./database");

const app = express();
app.use(cors());
app.use(express.json());
import complaintsRoute from "./routes/complaints.js";

// Get complaints
app.get("/api/complaints", (req, res) => {
  db.all("SELECT * FROM complaints", [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});
// Get single complaint
app.get("/api/complaints/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM complaints WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json(err);
    if (!row) return res.status(404).json({ error: "Complaint not found" });

    res.json(row);
  });
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

  db.run(
    `INSERT INTO complaints (title, description, category, location)
   VALUES (?, ?, ?, ?)`,
    [title, description, category, location],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        id: this.lastID,
        title,
        description,
        category,
        location,
        status: "Submitted",
      });
    }
  );
});

// Admin update status
app.patch("/api/admin/complaints/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.run(
    "UPDATE complaints SET status = ? WHERE id = ?",
    [status, id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({ message: "Status updated" });
    }
  );
});

app.post("/api/logout", (_, res) => {
  res.json({ message: "Logged out" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
