const express = require("express");
const runValidation = require("../validators");
const {
    handelLogin,
    handelLogout,
    handelRefreshToken,
    handelProtectedRoute,
} = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");
const { validateUserLogin } = require("../validators/auth");

const authRouter = express.Router();

authRouter.post(
    "/login",
    validateUserLogin,
    runValidation,
    isLoggedOut,
    handelLogin
);
authRouter.post("/logout", isLoggedIn, handelLogout);
authRouter.get("/refresh-token", handelRefreshToken);
authRouter.get("/protected", handelProtectedRoute);

module.exports = authRouter;
