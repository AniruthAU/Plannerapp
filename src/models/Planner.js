const mongoose = require("mongoose");
const plannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Planner", plannerSchema);
