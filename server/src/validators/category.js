const { body } = require("express-validator");

const validateCategory = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ min: 3 })
        .withMessage("category name must be at least 3 characters"),
];

module.exports = { validateCategory };
