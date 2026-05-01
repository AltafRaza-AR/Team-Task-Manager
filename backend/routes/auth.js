const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// @route   POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // 2. Check if admin already exists - enforce single admin policy
    const adminExists = await User.findOne({ role: "Admin" });
    let assignedRole = role || "Member";
    if (adminExists && assignedRole === "Admin") {
      return res
        .status(400)
        .json({ message: "Admin already exists. Only members can sign up." });
    }
    // If admin exists, force new user to be Member
    if (adminExists) {
      assignedRole = "Member";
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    await user.save();

    // 5. Generate JWT Token
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

// @route   DELETE /api/auth/users/:id
// @desc    Delete a user (Admin only)
router.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only Admins can delete users" });
    }

    // Prevent admin from deleting themselves
    if (req.user.userId === req.params.id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    // Prevent deletion of admin users
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToDelete.role === "Admin") {
      return res
        .status(403)
        .json({ message: "Cannot delete other admin accounts" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting user" });
  }
});

// @route   GET /api/auth/user/:id
// @desc    Get user profile by ID (authenticated users can view their own or admin can view any)
router.get("/user/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email role createdAt",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching user" });
  }
});

// @route   GET /api/auth/admin-exists
// @desc    Check if an admin user exists (public endpoint)
router.get("/admin-exists", async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: "Admin" });
    res.json({ adminExists: !!adminExists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error checking admin" });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password (authenticated users only)
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    // Find the user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error changing password" });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Create a password reset token for a user
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists for that email, a reset token has been generated.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 1000 * 60 * 30;
    await user.save();

    const response = {
      message:
        "If an account exists for that email, a reset token has been generated.",
    };

    if (process.env.NODE_ENV !== "production") {
      response.resetToken = resetToken;
    }

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating reset token" });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset a password using a valid reset token
router.post("/reset-password", async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    if (user.passwordResetExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    if (tokenHash !== user.passwordResetToken) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error resetting password" });
  }
});

module.exports = router;
