const { body } = require("express-validator");

const validateProduct = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 150 })
        .withMessage(
            "Please enter a valid product name in between 3 to 150 characters"
        ),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 3 })
        .withMessage("Description must be at least 3 characters"),
    body("price")
        .trim()
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("quantity")
        .trim()
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive number"),
    body("image").optional().isString().withMessage("User image is optional"),
];

module.exports = { validateProduct };
