import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* -------------------------------------
   REGISTER
------------------------------------- */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user", // ⭐ ensures new users are NOT admin
    });

    res.status(201).json("User Registered Successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

/* -------------------------------------
   LOGIN FIXED
------------------------------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json("Invalid Email");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Invalid Password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // SAFE USER (no password)
    const safeUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      interests: user.interests,
      createdAt: user.createdAt,
    };

    console.log("USER SENT TO FRONTEND:", safeUser);

    res.status(200).json({ token, user: safeUser });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

