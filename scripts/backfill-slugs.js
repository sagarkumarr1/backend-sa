// backend/scripts/backfill-slugs.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import Post from "../models/Post.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const posts = await Post.find({});
  for (const post of posts) {
    if (!post.slug) {
      let base = slugify(post.title || `post-${post._id}`, { lower: true, strict: true });
      let slug = base;
      let count = 0;
      while (await Post.findOne({ slug })) {
        count += 1;
        slug = `${base}-${count}`;
      }
      post.slug = slug;
      await post.save();
      console.log("Updated:", post._id, slug);
    }
  }

  console.log("Done backfilling slugs");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
