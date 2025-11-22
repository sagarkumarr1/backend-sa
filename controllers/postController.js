import Post from "../models/Post.js";
import slugify from "slugify";

/* =====================================================
   CREATE POST
===================================================== */
export const createPost = async (req, res) => {
  try {
    const { title, content, thumbnail, category } = req.body;

    // generate slug
    const slug = slugify(title, { lower: true, strict: true });

    const newPost = await Post.create({
      title,
      content,
      thumbnail,
      category,
      slug,
      author: req.user._id,
      views: 0
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

/* =====================================================
   GET ALL POSTS
===================================================== */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

/* =====================================================
   GET SINGLE POST BY ID (fallback)
===================================================== */
export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username"
    );

    if (!post) return res.status(404).json("Post not found");

    // increase views
    post.views += 1;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

/* =====================================================
   GET POST BY SLUG (main method for frontend)
===================================================== */
export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      "author",
      "username"
    );

    if (!post) return res.status(404).json("Post not found");

    // increase views
    post.views = (post.views || 0) + 1;
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

/* =====================================================
   UPDATE POST
===================================================== */
export const updatePost = async (req, res) => {
  try {
    // update slug when title changes
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }

    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

/* =====================================================
   DELETE POST
===================================================== */
export const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("Post deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

/* =====================================================
   TRENDING POSTS
===================================================== */
export const getTrendingPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ views: -1 }).limit(5);
    res.json(posts);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
