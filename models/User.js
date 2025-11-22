// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    // ⭐ ROLE SYSTEM
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    // ⭐ OPTIONAL INTERESTS
    interests: {
      type: [String],
      default: [],
    }
  },
  { timestamps: true }
);

// Prevent changing role through update queries accidentally
userSchema.pre("findOneAndUpdate", function (next) {
  delete this._update.role;
  next();
});

export default mongoose.model("User", userSchema);
