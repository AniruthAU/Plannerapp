const express = require("express");
const Planner = require("../models/Planner");
const verifyToken = require("../middleware/authMiddleware");
const { plannerValidationRules, validate } = require("../middleware/validatePlanner");

const router = express.Router();

// GET all planners of the logged-in user
router.get("/", verifyToken, async (req, res) => {
  const planners = await Planner.find({ owner: req.user.userId });
  res.json(planners);
});

// GET planner by ID
router.get("/:id", verifyToken, async (req, res) => {
  const planner = await Planner.findOne({ _id: req.params.id, owner: req.user.userId });
  if (!planner) return res.status(404).json({ msg: "Planner not found" });
  res.json(planner);
});

// CREATE planner (with validation)
router.post("/", verifyToken, plannerValidationRules, validate, async (req, res) => {
  const { title, description } = req.body;
  const planner = await Planner.create({
    title,
    description,
    owner: req.user.userId
  });
  res.status(201).json(planner);
});

// UPDATE planner (with validation)
router.put("/:id", verifyToken, plannerValidationRules, validate, async (req, res) => {
  const planner = await Planner.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.userId },
    req.body,
    { new: true }
  );
  if (!planner) return res.status(404).json({ msg: "Planner not found" });
  res.json(planner);
});

// DELETE planner
router.delete("/:id", verifyToken, async (req, res) => {
  const planner = await Planner.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
  if (!planner) return res.status(404).json({ msg: "Planner not found" });
  res.json({ msg: "Planner deleted" });
});

module.exports = router;
