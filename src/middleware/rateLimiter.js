const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: "❌ Too many requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
