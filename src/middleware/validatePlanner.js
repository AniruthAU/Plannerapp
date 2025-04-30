const { body, validationResult } = require("express-validator");

const plannerValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").isLength({ min: 3 }).withMessage("Description too short")
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { plannerValidationRules, validate };
