const express = require("express");
const {
    handelGetUsers,
    handelGetUserByID,
    handelDeleteUserByID,
    handelProcessRegister,
    handelActivateUserAccount,
    handelUpdateUserById,
    handelBanUserById,
    handelUnbanUserById,
} = require("../controllers/userController");
const { validateUserRegistration } = require("../validators/auth");
const runValidation = require("../validators");
const uploadUserImage = require("../middlewares/uploadFiles");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.post(
    "/process-register",
    isLoggedOut,
    uploadUserImage.single("image"),
    validateUserRegistration,
    runValidation,
    handelProcessRegister
);
userRouter.post("/activate", isLoggedOut, handelActivateUserAccount);
userRouter.get("/", isLoggedIn, isAdmin, handelGetUsers);
userRouter.get("/:id", isLoggedIn, handelGetUserByID);
userRouter.delete("/:id", isLoggedIn, handelDeleteUserByID);
userRouter.put(
    "/:id",
    isLoggedIn,
    uploadUserImage.single("image"),
    handelUpdateUserById
);
userRouter.put("/ban-user/:id", isLoggedIn, isAdmin, handelBanUserById);
userRouter.put("/unban-user/:id", isLoggedIn, isAdmin, handelUnbanUserById);
module.exports = userRouter;
