import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  getPostBySlug
} from "../controllers/postController.js";
import Post from "../models/Post.js";

const router = express.Router();

/* ---------------------------------------------
   ⭐ HELPER: Check Admin
---------------------------------------------- */
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json("Only admin is allowed to perform this action");
  }
  next();
};

/* ---------------------------------------------
   🔥 TRENDING POSTS  (Must be BEFORE :id)
---------------------------------------------- */
router.get("/trending", async (req, res) => {
  try {
    const posts = await Post.find().sort({ views: -1 }).limit(5);
    res.json(posts);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/* ---------------------------------------------
   🔥 SMART RECOMMENDED POSTS
---------------------------------------------- */
router.get("/recommend/:slug", async (req, res) => {
  try {
    const current = await Post.findOne({ slug: req.params.slug });

    if (!current) return res.status(404).json("Post not found");

    // Find recommended posts
    let recommended = await Post.find({
      _id: { $ne: current._id },                // exclude current post
      category: current.category               // match same category
    })
      .limit(6)
      .lean();

    // if no category match → random fallback
    if (!recommended.length) {
      recommended = await Post.find({ _id: { $ne: current._id } })
        .sort({ views: -1 })
        .limit(6)
        .lean();
    }

    res.json(recommended);

  } catch (err) {
    res.status(500).json(err.message);
  }
});

/* ---------------------------------------------
   🔥 GET POST BY SLUG  (Must be before :id)
---------------------------------------------- */
router.get("/slug/:slug", getPostBySlug);

/* ---------------------------------------------
   📌 GET ALL POSTS (Public)
---------------------------------------------- */
router.get("/", getAllPosts);

/* ---------------------------------------------
   🔥 CREATE POST  (Admin Only)
---------------------------------------------- */
router.post("/", protect, isAdmin, createPost);

/* ---------------------------------------------
   🔥 UPDATE POST  (Admin Only)
---------------------------------------------- */
router.put("/:id", protect, isAdmin, updatePost);

/* ---------------------------------------------
   🔥 DELETE POST  (Admin Only)
---------------------------------------------- */
router.delete("/:id", protect, isAdmin, deletePost);

/* ---------------------------------------------
   📌 GET POST BY ID (Public)
---------------------------------------------- */
router.get("/:id", getSinglePost);

export default router;
