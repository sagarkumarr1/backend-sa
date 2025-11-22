// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// -----------------------------
// 🔐 PROTECT ROUTE (Login Required)
// -----------------------------
export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json("No token, authorization denied");
    }

    token = token.split(" ")[1]; // remove "Bearer"

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json("User not found");
    }

    next();
  } catch (err) {
    return res.status(401).json("Invalid or expired token");
  }
};

// -----------------------------
// 🔐 ADMIN ONLY ROUTE
// -----------------------------
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json("Access denied. Admin only.");
  }
  next();
};
