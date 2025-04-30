const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config();

const app = express();

const plannerRoutes = require("./src/routes/plannerRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const authRoutes = require("./src/routes/authRoutes");
const rateLimiter = require("./src/middleware/rateLimiter"); // ✅ here

// ✅ Apply rate limiter BEFORE routes
app.use("/api", rateLimiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/planners", plannerRoutes);
app.use("/api/tasks", taskRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Planner API running");
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 4000, () =>
      console.log(`✅ Server running on port ${process.env.PORT || 4000}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
