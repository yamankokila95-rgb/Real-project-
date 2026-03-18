import express from "express";
import cors from "cors";
import db from "./database.js";
import authRoutes from "./routes/auth.js";
import checkinRoutes from "./routes/checkins.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", checkinRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🌿 MindCare server running on port ${PORT}`));
