import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "mindcare-jwt-secret-2024";

export const requireAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
