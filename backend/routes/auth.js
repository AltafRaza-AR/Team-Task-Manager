const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// @route   POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "Member", // Default to Member if not provided
    });

    await user.save();

    // 4. Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // 2. Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // 3. Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// @route   GET /api/auth/users/count
// @desc    Get all users count (Admin only)
router.get("/users/count", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only Admins can view member count" });
    }
    const usersCount = await User.countDocuments();
    res.json({ count: usersCount });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching users count" });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users list (Admin only)
router.get("/users", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only Admins can view users list" });
    }
    const users = await User.find().select("name email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching users list" });
  }
});

module.exports = router;
