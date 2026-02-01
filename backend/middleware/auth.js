import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
