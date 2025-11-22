// backend/models/Post.js
import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: String,
    thumbnail: String,
    category: { type: String, default: "General" },
    views: { type: Number, default: 0 },
    slug: { type: String, unique: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

/* ------------------------------------------
   ✅ FIXED SLUG SYSTEM (BEST & SAFE VERSION)
------------------------------------------ */
postSchema.pre("validate", async function (next) {
  if (!this.title) return next();

  // Generate base slug
  const baseSlug = slugify(this.title, { lower: true, strict: true });

  // If slug exists AND title has not changed → keep the old slug
  if (this.slug && this.slug.startsWith(baseSlug)) {
    return next();
  }

  // Generate unique slug
  let uniqueSlug = baseSlug;
  let counter = 1;

  // Check if slug exists (excluding current document on update)
  while (
    await this.constructor.findOne({
      slug: uniqueSlug,
      _id: { $ne: this._id },
    })
  ) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = uniqueSlug;
  next();
});

export default mongoose.model("Post", postSchema);
