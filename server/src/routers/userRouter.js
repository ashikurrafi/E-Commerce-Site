const express = require("express");
const {
    handelGetUsers,
    handelGetUserByID,
    handelDeleteUserByID,
    handelProcessRegister,
    handelActivateUserAccount,
    handelUpdateUserById,
    handelManageUserStatusById,
    handelUpdatePassword,
    handelForgetPassword,
    handelResetPassword,
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
    handelProcessRegister
);
// userRouter.post(
//     "/process-register",
//     isLoggedOut,
//     uploadUserImage.single("image"),
//     validateUserRegistration,
//     runValidation,
//     handelProcessRegister
// );
userRouter.post("/activate", isLoggedOut, handelActivateUserAccount);
userRouter.get("/", isLoggedIn, isAdmin, handelGetUsers);
userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, handelGetUserByID);
userRouter.delete("/:id([0-9a-fA-F]{24})", isLoggedIn, handelDeleteUserByID);
userRouter.put(
    "/:id([0-9a-fA-F]{24})",
    isLoggedIn,
    uploadUserImage.single("image"),
    handelUpdateUserById
);
userRouter.put(
    "/manage-user/:id([0-9a-fA-F]{24})",
    isLoggedIn,
    isAdmin,
    handelManageUserStatusById
);
userRouter.put(
    "/update-password/:id([0-9a-fA-F]{24})",
    validateUserUpdatePassword,
    runValidation,
    isLoggedIn,
    handelUpdatePassword
);
userRouter.post(
    "/forget-password",
    validateUserForgetPassword,
    runValidation,
    handelForgetPassword
);
userRouter.put(
    "/reset-password",
    validateUserResetPassword,
    runValidation,
    handelResetPassword
);

module.exports = userRouter;
