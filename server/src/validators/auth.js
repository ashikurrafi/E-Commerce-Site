const { body } = require("express-validator");

// Registration validation
const validateUserRegistration = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Name must be in 3-50 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be minimum 8 character long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, one digit and one special character."
        ),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required")
        .isLength({ min: 3 })
        .withMessage("Address must be minimum 6 character long"),

    body("phone").trim().notEmpty().withMessage("Phone number is required"),

    // body("image")
    //     .custom((value, { req }) => {
    //         if (!req.file || !req.file.buffer) {
    //             throw new Error("User image is required");
    //         }
    //         return true;
    //     })
    //     .withMessage("Image is required"),
];

const validateUserLogin = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be minimum 8 character long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, one digit and one special character."
        ),
];

const validateUserUpdatePassword = [
    body("oldPassword")
        .trim()
        .notEmpty()
        .withMessage("Old password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be minimum 8 character long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, one digit and one special character."
        ),

    body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be minimum 8 character long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, one digit and one special character."
        ),

    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error("Password did not match");
        }
        return true;
    }),
];

const validateUserForgetPassword = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),
];

const validateUserResetPassword = [
    body("token").trim().notEmpty().withMessage("Token is required"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be minimum 8 character long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, one digit and one special character."
        ),
];

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateUserUpdatePassword,
    validateUserForgetPassword,
    validateUserResetPassword,
};
