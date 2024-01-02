const express = require("express");
const {
    handleGetUsers,
    handleGetUserByID,
    handleDeleteUserByID,
    handleProcessRegister,
    handleActivateUserAccount,
    handleUpdateUserById,
    handleManageUserStatusById,
    handleUpdatePassword,
    handleForgetPassword,
    handleResetPassword,
} = require("../controllers/userController");
const {
    validateUserRegistration,
    validateUserUpdatePassword,
    validateUserForgetPassword,
    validateUserResetPassword,
} = require("../validators/auth");
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
    handleProcessRegister
);

userRouter.post("/activate", isLoggedOut, handleActivateUserAccount);
userRouter.get("/", isLoggedIn, isAdmin, handleGetUsers);
userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, handleGetUserByID);
userRouter.delete("/:id([0-9a-fA-F]{24})", isLoggedIn, handleDeleteUserByID);
userRouter.put(
    "/:id([0-9a-fA-F]{24})",
    isLoggedIn,
    uploadUserImage.single("image"),
    handleUpdateUserById
);
userRouter.put(
    "/manage-user/:id([0-9a-fA-F]{24})",
    isLoggedIn,
    isAdmin,
    handleManageUserStatusById
);
userRouter.put(
    "/update-password/:id([0-9a-fA-F]{24})",
    validateUserUpdatePassword,
    runValidation,
    isLoggedIn,
    handleUpdatePassword
);
userRouter.post(
    "/forget-password",
    validateUserForgetPassword,
    runValidation,
    handleForgetPassword
);
userRouter.put(
    "/reset-password",
    validateUserResetPassword,
    runValidation,
    handleResetPassword
);

module.exports = userRouter;
