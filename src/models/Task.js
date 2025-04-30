const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  status: { type: String, enum: ["pending", "in-progress", "done"], default: "pending" },
  planner: { type: mongoose.Schema.Types.ObjectId, ref: "Planner", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});
module.exports = mongoose.model("Task", taskSchema);
