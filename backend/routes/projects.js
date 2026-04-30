const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const authMiddleware = require("../middleware/auth");

// @route   POST /api/projects
// @desc    Create a new project (Admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res
        .status(403)
        .json({ message: "Only Admins can create projects" });

    const { name, description } = req.body;
    const project = new Project({
      name,
      description,
      createdBy: req.user.userId,
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/projects
// @desc    Get all projects
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Populate replaces the 'createdBy' ID with the actual user's name/email
    const projects = await Project.find().populate("createdBy", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});
// @route   DELETE /api/projects/:id
// @desc    Delete a project (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // 1. Security Check: Are they an Admin?
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only Admins can delete projects' });
    }

    // 2. Delete the project using the ID from the URL
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
