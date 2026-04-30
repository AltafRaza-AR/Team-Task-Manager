const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");

// @route   POST /api/tasks/main
// @desc    Create a new main task (Admin only)
router.post("/main", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res.status(403).json({ message: "Only Admins can create tasks" });

    const { title, dueDate, project } = req.body;
    const task = new Task({
      title,
      dueDate,
      project,
      assignedTo: req.user.userId,
      parentTask: null,
    });

    if (dueDate) {
      task.dueDate = dueDate;
    }

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/tasks/subtask
// @desc    Create a new subtask (Authenticated users)
router.post("/subtask", authMiddleware, async (req, res) => {
  try {
    const { title, dueDate, project, parentTask } = req.body;

    if (!parentTask) {
      return res.status(400).json({ message: "Parent task is required" });
    }

    const parent = await Task.findById(parentTask);
    if (!parent || parent.project.toString() !== project) {
      return res.status(400).json({ message: "Invalid parent task" });
    }

    const subtask = new Task({
      title,
      dueDate,
      project,
      parentTask,
      assignedTo: req.user.userId,
    });

    await subtask.save();
    res.status(201).json(subtask);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/tasks/project/:projectId
// @desc    Get all tasks for a specific project
router.get("/project/:projectId", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email role")
      .populate("parentTask", "title");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task status
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    // Find the task
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Ensure the logged-in user is actually assigned to this task (or is an Admin)
    if (
      task.assignedTo.toString() !== req.user.userId &&
      req.user.role !== "Admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task or subtask (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only Admins can delete tasks" });
    }

    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
