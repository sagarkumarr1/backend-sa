import mongoose from "mongoose";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const email = "admin@gmail.com";
    const password = "Admin@123";

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      username: "Admin",
      email,
      password: hashed,
      role: "admin",
    });

    console.log("Admin created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
