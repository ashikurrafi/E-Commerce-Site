const express = require("express");
const {
    handelGetUsers,
    handelGetUserByID,
    handelDeleteUserByID,
    handelProcessRegister,
    handelActivateUserAccount,
    handelUpdateUserById,
} = require("../controllers/userController");
const { validateUserRegistration } = require("../validators/auth");
const runValidation = require("../validators");
const uploadUserImage = require("../middlewares/uploadFiles");

const userRouter = express.Router();

userRouter.post(
    "/process-register",
    uploadUserImage.single("image"),
    validateUserRegistration,
    runValidation,
    handelProcessRegister
);
userRouter.post("/activate", handelActivateUserAccount);
userRouter.get("/", handelGetUsers);
userRouter.get("/:id", handelGetUserByID);
userRouter.delete("/:id", handelDeleteUserByID);
userRouter.put("/:id", uploadUserImage.single("image"), handelUpdateUserById);

module.exports = userRouter;
