const express = require("express");
const Task = require("../models/Task");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET all tasks with optional filters + pagination
router.get("/", verifyToken, async (req, res) => {
  const { status, title, planner, page = 1, limit = 5 } = req.query;

  const filter = {};
  if (planner) filter.planner = planner;
  if (status) filter.status = status;
  if (title) filter.title = { $regex: title, $options: "i" };

  try {
    const tasks = await Task.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

// GET task by ID
router.get("/:id", verifyToken, async (req, res) => {
  const task = await Task.findById(req.params.id).populate("assignedTo", "username");
  if (!task) return res.status(404).json({ msg: "Task not found" });
  res.json(task);
});

// CREATE task
router.post("/", verifyToken, async (req, res) => {
  const { title, description, dueDate, status, planner, assignedTo } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      dueDate,
      status,
      planner,
      assignedTo
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error creating task", err });
  }
});

// UPDATE task
router.put("/:id", verifyToken, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).json({ msg: "Task not found" });
  res.json(task);
});

// DELETE task
router.delete("/:id", verifyToken, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ msg: "Task not found" });
  res.json({ msg: "Task deleted" });
});

module.exports = router;
