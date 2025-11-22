import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json("No file uploaded");
  }

  res.json({ imageUrl: req.file.path });
});

export default router;
